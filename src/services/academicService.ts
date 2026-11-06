import {
  Subject,
  Section,
  FacultyMember,
  Room,
  FacultyAllocation,
  SubjectMarks,
  Announcement,
  CollegeClub,
  Complaint,
  AlumniProfile,
  FacultyFeedbackRecord,
  DepartmentEvent,
} from '../types/academic';
import {
  MOCK_SUBJECTS,
  MOCK_SECTIONS,
  MOCK_FACULTY,
  MOCK_ROOMS,
  MOCK_ALLOCATIONS,
  MOCK_STUDENT_MARKS,
  MOCK_ANNOUNCEMENTS,
  MOCK_CLUBS,
  MOCK_COMPLAINTS,
  MOCK_ALUMNI,
  MOCK_DEPARTMENT_EVENTS,
} from './mockData';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  submitComplaintToFirestore,
  fetchStudentComplaintsFromFirestore,
  submitFeedbackToFirestore,
} from './firestoreService';

// In-memory reactive stores
let subjectsStore: Subject[] = [...MOCK_SUBJECTS];
let sectionsStore: Section[] = [...MOCK_SECTIONS];
let facultyStore: FacultyMember[] = [...MOCK_FACULTY];
let roomsStore: Room[] = [...MOCK_ROOMS];
let allocationsStore: FacultyAllocation[] = [...MOCK_ALLOCATIONS];
let marksStore: SubjectMarks[] = [...MOCK_STUDENT_MARKS];
let announcementsStore: Announcement[] = [...MOCK_ANNOUNCEMENTS];
let clubsStore: CollegeClub[] = [...MOCK_CLUBS];
let complaintsStore: Complaint[] = [...MOCK_COMPLAINTS];
let alumniStore: AlumniProfile[] = [...MOCK_ALUMNI];
let feedbackStore: FacultyFeedbackRecord[] = [];
let eventsStore: DepartmentEvent[] = [...MOCK_DEPARTMENT_EVENTS];

export const academicService = {
  // Subjects
  async getSubjects(): Promise<Subject[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('subjects').select('*');
        if (!error && data && data.length > 0) return data as Subject[];
      } catch (err) {
        console.warn('Could not fetch subjects from external database, using local store:', err);
      }
    }
    return Promise.resolve([...subjectsStore]);
  },

  async getSubjectById(id: string): Promise<Subject | undefined> {
    return Promise.resolve(subjectsStore.find(s => s.id === id));
  },

  async addSubject(subject: Omit<Subject, 'id'>): Promise<Subject> {
    const newSubject: Subject = {
      ...subject,
      id: `sub-${Date.now()}`,
    };
    subjectsStore = [newSubject, ...subjectsStore];
    return Promise.resolve(newSubject);
  },

  async createSubject(subject: any): Promise<Subject> {
    return this.addSubject(subject);
  },

  async deleteSubject(id: string): Promise<void> {
    subjectsStore = subjectsStore.filter(s => s.id !== id);
    allocationsStore = allocationsStore.filter(a => a.subjectId !== id);
    return Promise.resolve();
  },

  // Sections
  async getSections(): Promise<Section[]> {
    return Promise.resolve([...sectionsStore]);
  },

  // Faculty
  async getFaculty(): Promise<FacultyMember[]> {
    return Promise.resolve([...facultyStore]);
  },

  async addFaculty(member: Omit<FacultyMember, 'id'>): Promise<FacultyMember> {
    const newMember: FacultyMember = { ...member, id: `fac-${Date.now()}` };
    facultyStore = [...facultyStore, newMember];
    return Promise.resolve(newMember);
  },

  async deleteFaculty(id: string): Promise<void> {
    facultyStore = facultyStore.filter(f => f.id !== id);
    allocationsStore = allocationsStore.filter(a => a.facultyId !== id);
    return Promise.resolve();
  },

  // Rooms
  async getRooms(): Promise<Room[]> {
    return Promise.resolve([...roomsStore]);
  },

  async addRoom(room: Omit<Room, 'id'>): Promise<Room> {
    const newRoom: Room = { ...room, id: `room-${Date.now()}` };
    roomsStore = [...roomsStore, newRoom];
    return Promise.resolve(newRoom);
  },

  async toggleRoomAvailability(id: string): Promise<Room> {
    roomsStore = roomsStore.map(r => (r.id === id ? { ...r, isAvailable: !r.isAvailable } : r));
    const updated = roomsStore.find(r => r.id === id);
    if (!updated) throw new Error('Room not found');
    return Promise.resolve(updated);
  },

  // Allocations
  async getAllocations(): Promise<FacultyAllocation[]> {
    return Promise.resolve([...allocationsStore]);
  },

  async addAllocation(alloc: Omit<FacultyAllocation, 'id'>): Promise<FacultyAllocation> {
    const newAlloc: FacultyAllocation = { ...alloc, id: `alloc-${Date.now()}` };
    allocationsStore = [...allocationsStore, newAlloc];
    return Promise.resolve(newAlloc);
  },

  async deleteAllocation(id: string): Promise<void> {
    allocationsStore = allocationsStore.filter(a => a.id !== id);
    return Promise.resolve();
  },

  // Marks & Grading
  async getStudentMarks(studentId: string = 'user-std-001'): Promise<SubjectMarks[]> {
    return Promise.resolve([...marksStore.filter(m => m.studentId === studentId)]);
  },

  async getAllMarks(): Promise<SubjectMarks[]> {
    return Promise.resolve([...marksStore]);
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return Promise.resolve([...announcementsStore]);
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> {
    const newAnn: Announcement = {
      ...announcement,
      id: `anc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    announcementsStore = [newAnn, ...announcementsStore];
    return Promise.resolve(newAnn);
  },

  // Clubs
  async getClubs(): Promise<CollegeClub[]> {
    return Promise.resolve([...clubsStore]);
  },

  async toggleClubJoin(clubId: string): Promise<CollegeClub> {
    clubsStore = clubsStore.map(c => {
      if (c.id === clubId) {
        const nextState = !c.isJoined;
        return {
          ...c,
          isJoined: nextState,
          memberCount: nextState ? c.memberCount + 1 : c.memberCount - 1,
          role: nextState ? 'Member' : undefined,
        };
      }
      return c;
    });
    const found = clubsStore.find(c => c.id === clubId);
    if (!found) throw new Error('Club not found');
    return Promise.resolve(found);
  },

  // Complaints
  async getComplaints(studentId?: string): Promise<Complaint[]> {
    try {
      const remote = await fetchStudentComplaintsFromFirestore();
      if (remote && remote.length > 0) {
        // Merge with local store without duplicate IDs
        const existingIds = new Set(remote.map(r => r.id));
        const filteredLocal = complaintsStore.filter(c => !existingIds.has(c.id));
        return [...remote, ...filteredLocal];
      }
    } catch (e) {
      // Fallback to local store
    }
    if (studentId) {
      return Promise.resolve(complaintsStore.filter(c => c.studentId === studentId));
    }
    return Promise.resolve([...complaintsStore]);
  },

  async submitComplaint(data: Omit<Complaint, 'id' | 'createdAt' | 'status'>): Promise<Complaint> {
    try {
      const savedDoc = await submitComplaintToFirestore(data);
      if (savedDoc) {
        complaintsStore = [savedDoc, ...complaintsStore];
        return savedDoc;
      }
    } catch (e) {
      console.warn('Writing to local store fallback:', e);
    }

    const newComplaint: Complaint = {
      ...data,
      id: `cmp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'open',
    };
    complaintsStore = [newComplaint, ...complaintsStore];
    return Promise.resolve(newComplaint);
  },

  async updateComplaintStatus(id: string, status: 'open' | 'in_progress' | 'resolved', resolutionNote?: string): Promise<Complaint> {
    complaintsStore = complaintsStore.map(c => (c.id === id ? { ...c, status, resolutionNote } : c));
    const updated = complaintsStore.find(c => c.id === id);
    if (!updated) throw new Error('Complaint not found');
    return Promise.resolve(updated);
  },

  // Alumni Directory
  async getAlumni(): Promise<AlumniProfile[]> {
    return Promise.resolve([...alumniStore]);
  },

  // Faculty Feedback
  async submitFacultyFeedback(data: Omit<FacultyFeedbackRecord, 'id' | 'submittedAt'>): Promise<FacultyFeedbackRecord> {
    try {
      const remoteFeedback = await submitFeedbackToFirestore({
        facultyId: data.facultyId,
        facultyName: data.facultyName,
        subjectId: data.subjectId,
        subjectName: data.subjectName,
        ratingClarity: data.ratingClarity || 5,
        ratingPunctuality: data.ratingPunctuality || 5,
        ratingKnowledge: data.ratingKnowledge || 5,
        ratingFairness: data.ratingFairness || 5,
        comments: data.comments || '',
      });
      if (remoteFeedback) {
        feedbackStore = [remoteFeedback, ...feedbackStore];
        return remoteFeedback;
      }
    } catch (e) {
      console.warn('Writing feedback locally fallback:', e);
    }

    const newFeedback: FacultyFeedbackRecord = {
      ...data,
      id: `fb-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    feedbackStore = [newFeedback, ...feedbackStore];
    return Promise.resolve(newFeedback);
  },

  async getFacultyFeedbackList(facultyId?: string): Promise<FacultyFeedbackRecord[]> {
    if (facultyId) {
      return Promise.resolve(feedbackStore.filter(f => f.facultyId === facultyId));
    }
    return Promise.resolve([...feedbackStore]);
  },

  // Department Events
  async getDepartmentEvents(): Promise<DepartmentEvent[]> {
    return Promise.resolve([...eventsStore]);
  },

  async createDepartmentEvent(event: Omit<DepartmentEvent, 'id' | 'participantsCount'>): Promise<DepartmentEvent> {
    const newEvent: DepartmentEvent = {
      ...event,
      id: `ev-${Date.now()}`,
      participantsCount: 0,
    };
    eventsStore = [newEvent, ...eventsStore];
    return Promise.resolve(newEvent);
  },
};
