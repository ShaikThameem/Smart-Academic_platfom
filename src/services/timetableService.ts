import {
  TimetableSlot,
  TimetableConfig,
  FacultyFeedback,
  DayOfWeek,
} from '../types/academic';
import {
  MOCK_PUBLISHED_TIMETABLE,
  MOCK_FACULTY_FEEDBACK,
  DEFAULT_TIMETABLE_CONFIG,
} from './mockData';
import { academicService } from './academicService';

export interface TimetableConflict {
  id: string;
  slotA: TimetableSlot;
  slotB?: TimetableSlot;
  type: 'faculty_overlap' | 'room_overlap' | 'section_overlap' | 'high_credit_consecutive' | 'room_unavailable';
  description: string;
  severity: 'error' | 'warning';
}

export interface GenerationResult {
  slots: TimetableSlot[];
  conflicts: TimetableConflict[];
  unscheduledCount: number;
  qualityScore: number; // percentage
  version: string;
}

// In-memory timetable stores
let publishedSlots: TimetableSlot[] = [...MOCK_PUBLISHED_TIMETABLE];
let draftSlots: TimetableSlot[] = [...MOCK_PUBLISHED_TIMETABLE.map(s => ({ ...s, id: `draft-${s.id}`, isPublished: false, version: 'v2.2-draft' }))];
let feedbackStore: FacultyFeedback[] = [...MOCK_FACULTY_FEEDBACK];
let currentConfig: TimetableConfig = { ...DEFAULT_TIMETABLE_CONFIG };
let currentPublishedVersion = 'v2.1';
let publishedDate = '2026-09-15';

export const timetableService = {
  getConfig(): TimetableConfig {
    return { ...currentConfig };
  },

  updateConfig(config: Partial<TimetableConfig>): TimetableConfig {
    currentConfig = { ...currentConfig, ...config };
    return { ...currentConfig };
  },

  getPublishedVersionInfo() {
    return {
      version: currentPublishedVersion,
      publishedDate,
      isPublished: true,
      totalSlots: publishedSlots.length,
    };
  },

  // Student & Faculty view: ONLY published timetable
  async getPublishedTimetable(sectionId?: string, facultyId?: string): Promise<TimetableSlot[]> {
    let slots = [...publishedSlots];
    if (sectionId) {
      slots = slots.filter(s => s.sectionId === sectionId);
    }
    if (facultyId) {
      slots = slots.filter(s => s.facultyId === facultyId);
    }
    return Promise.resolve(slots);
  },

  // HOD / Admin view: Draft timetable
  async getDraftTimetable(sectionId?: string): Promise<TimetableSlot[]> {
    let slots = [...draftSlots];
    if (sectionId) {
      slots = slots.filter(s => s.sectionId === sectionId);
    }
    return Promise.resolve(slots);
  },

  // Conflict Detection Engine
  detectConflicts(slots: TimetableSlot[]): TimetableConflict[] {
    const conflicts: TimetableConflict[] = [];

    // Helper to check if two time ranges overlap
    const timeToMins = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const isOverlap = (a: TimetableSlot, b: TimetableSlot) => {
      if (a.day !== b.day) return false;
      const aStart = timeToMins(a.startTime);
      const aEnd = timeToMins(a.endTime);
      const bStart = timeToMins(b.startTime);
      const bEnd = timeToMins(b.endTime);
      return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
    };

    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const slotA = slots[i];
        const slotB = slots[j];

        if (isOverlap(slotA, slotB)) {
          // Faculty clash
          if (slotA.facultyId === slotB.facultyId) {
            conflicts.push({
              id: `fac-clash-${slotA.id}-${slotB.id}`,
              slotA,
              slotB,
              type: 'faculty_overlap',
              description: `Faculty is assigned simultaneously on ${slotA.day} between ${slotA.startTime}-${slotA.endTime} and ${slotB.startTime}-${slotB.endTime}`,
              severity: 'error',
            });
          }

          // Room clash
          if (slotA.roomId === slotB.roomId) {
            conflicts.push({
              id: `room-clash-${slotA.id}-${slotB.id}`,
              slotA,
              slotB,
              type: 'room_overlap',
              description: `Room is double-booked on ${slotA.day} between ${slotA.startTime}-${slotA.endTime}`,
              severity: 'error',
            });
          }

          // Section clash
          if (slotA.sectionId === slotB.sectionId) {
            conflicts.push({
              id: `sec-clash-${slotA.id}-${slotB.id}`,
              slotA,
              slotB,
              type: 'section_overlap',
              description: `Section ${slotA.sectionId} has concurrent sessions on ${slotA.day}`,
              severity: 'error',
            });
          }
        }
      }
    }

    return conflicts;
  },

  // Intelligent Timetable Generator
  async generateDraftTimetable(sectionId: string, customConfig?: Partial<TimetableConfig>): Promise<GenerationResult> {
    const config = { ...currentConfig, ...customConfig };
    const subjects = await academicService.getSubjects();
    const allocations = await academicService.getAllocations();
    const rooms = await academicService.getRooms();

    const sectionAllocations = allocations.filter(a => a.sectionId === sectionId);
    const newSlots: TimetableSlot[] = [];

    // Working time slots breakdown starting at 08:30 AM
    // Theory: 1 hr
    // Breaks: 10m
    // Labs: 2.5 hrs (150 min)
    const days: DayOfWeek[] = config.academicDays;

    // Time schedule templates
    const morningSlots = [
      { start: '08:30', end: '09:30', isLab: false },
      { start: '09:30', end: '10:30', isLab: false },
    ];
    // 10m break (10:30 - 10:40)
    const midMorningTheory = [
      { start: '10:40', end: '11:40', isLab: false },
      { start: '11:40', end: '12:40', isLab: false },
    ];
    const midMorningLab = [
      { start: '10:40', end: '13:10', isLab: true }, // 2.5 hr lab
    ];
    const afternoonTheory = [
      { start: '14:00', end: '15:00', isLab: false },
      { start: '15:00', end: '16:00', isLab: false },
    ];
    const afternoonLab = [
      { start: '13:00', end: '15:30', isLab: true },
    ];

    const theoryAllocations = sectionAllocations.filter(a => {
      const sub = subjects.find(s => s.id === a.subjectId);
      return sub?.type === 'theory';
    });

    const labAllocations = sectionAllocations.filter(a => {
      const sub = subjects.find(s => s.id === a.subjectId);
      return sub?.type === 'lab';
    });

    const theoryRooms = rooms.filter(r => r.type === 'classroom' && r.isAvailable);
    const labRooms = rooms.filter(r => r.type === 'lab' && r.isAvailable);

    let theoryIndex = 0;
    let labIndex = 0;
    let slotCounter = 1;

    days.forEach((day) => {
      const isFriday = day === 'Friday';

      if (isFriday && config.fridayLabOnly && labAllocations.length > 0) {
        // Dedicated Friday Lab Schedule
        const labAlloc = labAllocations[labIndex % labAllocations.length];
        labIndex++;
        const labRoom = labRooms[0] || rooms[0];

        newSlots.push({
          id: `gen-slot-${slotCounter++}`,
          day,
          startTime: '08:30',
          endTime: '11:00',
          subjectId: labAlloc.subjectId,
          facultyId: labAlloc.facultyId,
          roomId: labRoom.id,
          sectionId,
          isLab: true,
          version: 'v2.2-draft',
          isPublished: false,
        });

        // 10 min break -> Theory wrap or second lab
        const secondLab = labAllocations[labIndex % labAllocations.length];
        newSlots.push({
          id: `gen-slot-${slotCounter++}`,
          day,
          startTime: '13:00',
          endTime: '15:30',
          subjectId: secondLab ? secondLab.subjectId : labAlloc.subjectId,
          facultyId: secondLab ? secondLab.facultyId : labAlloc.facultyId,
          roomId: labRooms[1] ? labRooms[1].id : labRoom.id,
          sectionId,
          isLab: true,
          version: 'v2.2-draft',
          isPublished: false,
        });
        return;
      }

      // Standard Day (Mon - Thu)
      // Morning slots (8:30 - 10:30)
      morningSlots.forEach(time => {
        if (theoryAllocations.length > 0) {
          const alloc = theoryAllocations[theoryIndex % theoryAllocations.length];
          theoryIndex++;
          const room = theoryRooms[theoryIndex % theoryRooms.length] || rooms[0];
          newSlots.push({
            id: `gen-slot-${slotCounter++}`,
            day,
            startTime: time.start,
            endTime: time.end,
            subjectId: alloc.subjectId,
            facultyId: alloc.facultyId,
            roomId: room.id,
            sectionId,
            isLab: false,
            version: 'v2.2-draft',
            isPublished: false,
          });
        }
      });

      // Wednesday or Monday gets a 2.5 hr lab
      if ((day === 'Monday' || day === 'Wednesday') && labAllocations.length > 0) {
        const labAlloc = labAllocations[labIndex % labAllocations.length];
        labIndex++;
        const labRoom = labRooms[labIndex % labRooms.length] || rooms[0];
        newSlots.push({
          id: `gen-slot-${slotCounter++}`,
          day,
          startTime: midMorningLab[0].start,
          endTime: midMorningLab[0].end,
          subjectId: labAlloc.subjectId,
          facultyId: labAlloc.facultyId,
          roomId: labRoom.id,
          sectionId,
          isLab: true,
          version: 'v2.2-draft',
          isPublished: false,
        });

        // Afternoon 1h theory
        if (theoryAllocations.length > 0) {
          const alloc = theoryAllocations[theoryIndex % theoryAllocations.length];
          theoryIndex++;
          newSlots.push({
            id: `gen-slot-${slotCounter++}`,
            day,
            startTime: afternoonTheory[0].start,
            endTime: afternoonTheory[0].end,
            subjectId: alloc.subjectId,
            facultyId: alloc.facultyId,
            roomId: theoryRooms[0]?.id || rooms[0].id,
            sectionId,
            isLab: false,
            version: 'v2.2-draft',
            isPublished: false,
          });
        }
      } else {
        // Thursday / Tuesday gets standard theory blocks
        midMorningTheory.forEach(time => {
          if (theoryAllocations.length > 0) {
            const alloc = theoryAllocations[theoryIndex % theoryAllocations.length];
            theoryIndex++;
            const room = theoryRooms[0] || rooms[0];
            newSlots.push({
              id: `gen-slot-${slotCounter++}`,
              day,
              startTime: time.start,
              endTime: time.end,
              subjectId: alloc.subjectId,
              facultyId: alloc.facultyId,
              roomId: room.id,
              sectionId,
              isLab: false,
              version: 'v2.2-draft',
              isPublished: false,
            });
          }
        });
      }
    });

    const conflicts = this.detectConflicts(newSlots);
    draftSlots = [...newSlots];

    return Promise.resolve({
      slots: newSlots,
      conflicts,
      unscheduledCount: Math.max(0, (theoryAllocations.length * 3 + labAllocations.length) - newSlots.length),
      qualityScore: conflicts.length === 0 ? 98 : Math.max(60, 95 - conflicts.length * 15),
      version: 'v2.2-draft',
    });
  },

  // Edit / Update a slot in draft
  async updateDraftSlot(slotId: string, updates: Partial<TimetableSlot>): Promise<TimetableSlot> {
    draftSlots = draftSlots.map(s => (s.id === slotId ? { ...s, ...updates } : s));
    const updated = draftSlots.find(s => s.id === slotId);
    if (!updated) throw new Error('Slot not found');
    return Promise.resolve(updated);
  },

  async deleteDraftSlot(slotId: string): Promise<void> {
    draftSlots = draftSlots.filter(s => s.id !== slotId);
    return Promise.resolve();
  },

  // HOD Approval & Publication
  async publishDraft(newVersionTag: string = 'v2.2'): Promise<{ version: string; slotCount: number }> {
    publishedSlots = draftSlots.map(s => ({
      ...s,
      isPublished: true,
      version: newVersionTag,
    }));
    currentPublishedVersion = newVersionTag;
    publishedDate = new Date().toISOString().split('T')[0];
    return Promise.resolve({
      version: currentPublishedVersion,
      slotCount: publishedSlots.length,
    });
  },

  async publishTimetable(title: string, slots?: TimetableSlot[]): Promise<{ versionNumber: string; slotCount: number }> {
    const res = await this.publishDraft('v2.2');
    return { versionNumber: res.version, slotCount: res.slotCount };
  },

  // Faculty Feedback
  async getFacultyFeedback(facultyId?: string): Promise<FacultyFeedback[]> {
    if (facultyId) {
      return Promise.resolve(feedbackStore.filter(f => f.facultyId === facultyId));
    }
    return Promise.resolve([...feedbackStore]);
  },

  async submitFacultyFeedback(data: Omit<FacultyFeedback, 'id' | 'createdAt' | 'status'>): Promise<FacultyFeedback> {
    const newFeedback: FacultyFeedback = {
      ...data,
      id: `fb-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    feedbackStore = [newFeedback, ...feedbackStore];
    return Promise.resolve(newFeedback);
  },

  async resolveFacultyFeedback(feedbackId: string, resolution: 'resolved' | 'rejected', note: string): Promise<FacultyFeedback> {
    feedbackStore = feedbackStore.map(f => {
      if (f.id === feedbackId) {
        return {
          ...f,
          status: resolution,
          resolvedAt: new Date().toISOString(),
          resolutionNote: note,
        };
      }
      return f;
    });
    const item = feedbackStore.find(f => f.id === feedbackId);
    if (!item) throw new Error('Feedback not found');
    return Promise.resolve(item);
  },
};
