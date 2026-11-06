export type Role = 'student' | 'faculty' | 'hod';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department: string;
  codeNumber: string; // USN for student, EmpID for faculty/HOD
  sectionId?: string; // For student
  sectionName?: string;
  semester?: number;
  batchYear?: string;
  phone?: string;
  address?: string;
  designation?: string; // For faculty/HOD
  qualification?: string;
  specialization?: string;
  cgpa?: number;
  totalCredits?: number;
}

export type SubjectType = 'theory' | 'lab' | 'elective' | 'core';

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  weeklySessions: number;
  type: SubjectType;
  durationHours: number; // 1.0 for theory, 2.5 for lab
  color: string;
  syllabusUrl?: string;
  facultyId?: string;
  weeklyHours?: number;
}

export interface Section {
  id: string;
  name: string;
  department: string;
  semester: number;
  studentCount: number;
  batchYear: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  specialization: string;
  qualification?: string;
  maxWeeklyHours: number;
  phone?: string;
  cabin?: string;
}

export type Faculty = FacultyMember;

export type RoomType = 'classroom' | 'lab' | 'seminar';

export interface Room {
  id: string;
  code: string;
  name: string;
  type: RoomType;
  capacity: number;
  building: string;
  floor: number;
  hasProjector: boolean;
  isAvailable: boolean;
}

export interface FacultyAllocation {
  id: string;
  facultyId: string;
  subjectId: string;
  sectionId: string;
  academicYear: string;
  semester: number;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "09:30" or "11:10"
  subjectId: string;
  facultyId: string;
  roomId: string;
  sectionId: string;
  isLab: boolean;
  version: string;
  isPublished: boolean;
  type?: 'theory' | 'lab';
  timeSlot?: string;
}

export interface TimetableConfig {
  academicDays: DayOfWeek[];
  startTime: string; // "08:30"
  theoryDurationMinutes: number; // 60
  labDurationMinutes: number; // 150 (2.5 hrs)
  breakAfterTheoryMinutes: number; // 10
  fridayLabOnly: boolean;
  lunchStartTime: string; // "12:40"
  lunchDurationMinutes: number; // 50
  maxDailyHoursPerFaculty: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  sectionId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  slotId?: string;
  sessionTitle?: string;
  remarks?: string;
}

export interface StudentAttendanceSummary {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
  neededFor75: number;
  canMissNext: number;
}

// College Marks & Grades
export interface SubjectMarks {
  id: string;
  studentId: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  credits: number;
  cie1: number; // out of 50
  cie2: number; // out of 50
  assignmentMarks: number; // out of 20
  labMarks?: number; // out of 25
  totalCie: number; // Scaled out of 50
  seeMarks?: number; // Semester End Exam (out of 100 or 50)
  totalMarks: number; // 100
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F';
  gradePoint: number;
  status: 'PASS' | 'FAIL' | 'IN_PROGRESS';
}

export type AssessmentType = 'quiz' | 'midterm' | 'assignment' | 'lab_test';

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'mcq' | 'theory' | 'code';
  options?: string[];
  correctAnswer?: number | string;
  marks: number;
  codeSnippet?: string;
  explanation?: string;
}

export interface Assessment {
  id: string;
  title: string;
  subjectId: string;
  sectionId: string;
  type: AssessmentType;
  totalMarks: number;
  maxMarks?: number;
  durationMinutes: number;
  deadline: string;
  instructions: string;
  questions: AssessmentQuestion[];
  isPublished: boolean;
  createdAt: string;
  hasPyqReference?: boolean;
}

export interface StudentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName?: string;
  submittedAt: string;
  score?: number;
  totalMarks: number;
  status: 'submitted' | 'graded' | 'evaluated';
  answers: Record<string, string | number>;
  feedback?: string;
  fileUrl?: string;
}

export interface PreviousYearPaper {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  year: number;
  semester: number;
  examType: 'Mid-Term 1' | 'Mid-Term 2' | 'End Semester';
  fileSize: string;
  downloadUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Examination' | 'Department' | 'Placement' | 'Events';
  date: string;
  author: string;
  isImportant?: boolean;
}

export interface CollegeClub {
  id: string;
  name: string;
  category: 'Technical' | 'Cultural' | 'Coding' | 'Robotics' | 'Sports' | 'Social';
  description: string;
  leadName: string;
  facultyAdvisor: string;
  memberCount: number;
  meetingSchedule: string;
  isJoined?: boolean;
  role?: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName?: string;
  subject?: string;
  title?: string;
  category: 'Academic' | 'Infrastructure' | 'Hostel' | 'Examination' | 'Laboratory' | 'Other' | 'Lab & Infrastructure' | 'Evaluation & Marks' | 'Attendance Discrepancy' | 'Timetable Clash' | 'Hostel & Facilities';
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  isAnonymous: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  resolutionNote?: string;
}

export interface AlumniProfile {
  id: string;
  name: string;
  graduationYear?: number;
  batch?: string;
  department: string;
  currentCompany?: string;
  company?: string;
  currentRole?: string;
  role?: string;
  location: string;
  degree?: string;
  linkedinUrl?: string;
  email?: string;
  isMentorAvailable?: boolean;
  isAvailableForMentorship?: boolean;
}

export interface FacultyFeedbackRecord {
  id: string;
  studentId?: string;
  facultyId: string;
  facultyName?: string;
  subjectId: string;
  subjectName?: string;
  semester?: number;
  ratingClarity?: number; // 1-5
  ratingPunctuality?: number; // 1-5
  ratingKnowledge?: number; // 1-5
  ratingFairness?: number; // 1-5
  ratings?: Record<string, number>;
  overallRating?: number;
  comments: string;
  submittedAt?: string;
  createdAt?: string;
  status?: 'pending' | 'resolved' | 'rejected' | 'approved';
  reason?: string;
  suggestedDay?: string;
  suggestedTime?: string;
  resolutionNote?: string;
  resolvedAt?: string;
  slotId?: string;
}

export type FacultyFeedback = FacultyFeedbackRecord;

export interface DepartmentEvent {
  id: string;
  title: string;
  type?: 'Workshop' | 'Seminar' | 'Hackathon' | 'Guest Lecture' | 'Industrial Visit' | 'Conference';
  category?: 'Workshop' | 'Seminar' | 'Hackathon' | 'Guest Lecture' | 'Industrial Visit' | 'Conference' | 'hackathon' | 'guest_lecture' | 'workshop' | 'symposium' | 'cultural';
  description: string;
  eventDate?: string;
  date?: string;
  time: string;
  venue: string;
  coordinator?: string;
  participantsCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  status?: 'sent' | 'thinking' | 'error';
  suggestions?: string[];
  sources?: string[];
  topic?: string;
}
