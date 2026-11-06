import {
  User,
  Subject,
  Section,
  FacultyMember,
  Room,
  FacultyAllocation,
  TimetableSlot,
  AttendanceRecord,
  SubjectMarks,
  Assessment,
  StudentSubmission,
  PreviousYearPaper,
  Announcement,
  CollegeClub,
  Complaint,
  AlumniProfile,
  FacultyFeedbackRecord,
  DepartmentEvent,
  TimetableConfig
} from '../types/academic';

// Target UG User Profiles
export const MOCK_USERS: Record<string, User> = {
  student: {
    id: 'user-std-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    role: 'student',
    codeNumber: '1CS23CS001', // College USN
    department: 'Computer Science & Engineering',
    sectionId: 'sec-cse-5a',
    sectionName: 'CSE-5A',
    semester: 5,
    batchYear: '2024-2028',
    phone: '+91 98450 12345',
    address: 'Campus Hostel Block-3, Room 412, Bengaluru',
    cgpa: 8.84,
    totalCredits: 88,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  faculty: {
    id: 'user-fac-104',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@college.edu',
    role: 'faculty',
    codeNumber: 'EMP-CSE-104',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    qualification: 'Ph.D. (Distributed Systems, IIT Madras)',
    specialization: 'Algorithms, High Performance Computing',
    phone: '+91 98451 98765',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  hod: {
    id: 'user-hod-101',
    name: 'Dr. Meenakshi Sundaram',
    email: 'hod.cse@college.edu',
    role: 'hod',
    codeNumber: 'EMP-CSE-101',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Head of Department',
    qualification: 'Ph.D., Post-Doc (AI & Distributed Systems)',
    specialization: 'Computer Architectures & Cloud Topologies',
    phone: '+91 98452 45678',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
  },
};

export const MOCK_SECTIONS: Section[] = [
  { id: 'sec-cse-5a', name: 'CSE-5A', department: 'Computer Science & Engineering', semester: 5, studentCount: 62, batchYear: '2024-2028' },
  { id: 'sec-cse-5b', name: 'CSE-5B', department: 'Computer Science & Engineering', semester: 5, studentCount: 58, batchYear: '2024-2028' },
  { id: 'sec-cse-7a', name: 'CSE-7A', department: 'Computer Science & Engineering', semester: 7, studentCount: 60, batchYear: '2023-2027' },
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: 'sub-cs301', code: 'CS301', name: 'Advanced Data Structures & Algorithms', department: 'CSE', semester: 5, credits: 4, weeklySessions: 4, type: 'theory', durationHours: 1.0, color: '#0284c7' },
  { id: 'sub-cs302', code: 'CS302', name: 'Database Management Systems', department: 'CSE', semester: 5, credits: 4, weeklySessions: 4, type: 'theory', durationHours: 1.0, color: '#0d9488' },
  { id: 'sub-cs303', code: 'CS303', name: 'Computer Networks & Security', department: 'CSE', semester: 5, credits: 3, weeklySessions: 3, type: 'theory', durationHours: 1.0, color: '#d97706' },
  { id: 'sub-cs304', code: 'CS304', name: 'Operating Systems & System Programming', department: 'CSE', semester: 5, credits: 4, weeklySessions: 4, type: 'theory', durationHours: 1.0, color: '#6366f1' },
  { id: 'sub-cs305l', code: 'CS305L', name: 'Operating Systems & Networks Lab', department: 'CSE', semester: 5, credits: 2, weeklySessions: 1, type: 'lab', durationHours: 2.5, color: '#0891b2' },
  { id: 'sub-cs306l', code: 'CS306L', name: 'DBMS & Web Technologies Lab', department: 'CSE', semester: 5, credits: 2, weeklySessions: 1, type: 'lab', durationHours: 2.5, color: '#14b8a6' },
  { id: 'sub-cs307', code: 'CS307', name: 'Software Engineering & Agile Methodologies', department: 'CSE', semester: 5, credits: 3, weeklySessions: 3, type: 'theory', durationHours: 1.0, color: '#e11d48' },
];

export const MOCK_FACULTY: FacultyMember[] = [
  { id: 'fac-104', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@college.edu', employeeId: 'EMP-CSE-104', department: 'Computer Science & Engineering', designation: 'Associate Professor', specialization: 'Algorithms & Graph Theory', maxWeeklyHours: 18 },
  { id: 'fac-102', name: 'Prof. Anita Sharma', email: 'anita.sharma@college.edu', employeeId: 'EMP-CSE-102', department: 'Computer Science & Engineering', designation: 'Assistant Professor', specialization: 'Database Systems & SQL Optimization', maxWeeklyHours: 20 },
  { id: 'fac-103', name: 'Dr. S. Ramanujan', email: 'ramanujan.s@college.edu', employeeId: 'EMP-CSE-103', department: 'Computer Science & Engineering', designation: 'Professor', specialization: 'Computer Networks & Network Security', maxWeeklyHours: 16 },
  { id: 'fac-105', name: 'Prof. Kevin Scott', email: 'kevin.scott@college.edu', employeeId: 'EMP-CSE-105', department: 'Computer Science & Engineering', designation: 'Assistant Professor', specialization: 'Operating Systems & Kernel Dev', maxWeeklyHours: 20 },
  { id: 'fac-106', name: 'Dr. Deepa Krishnan', email: 'deepa.krishnan@college.edu', employeeId: 'EMP-CSE-106', department: 'Computer Science & Engineering', designation: 'Associate Professor', specialization: 'Software Engineering & Design Patterns', maxWeeklyHours: 18 },
  { id: 'fac-101', name: 'Dr. Meenakshi Sundaram', email: 'hod.cse@college.edu', employeeId: 'EMP-CSE-101', department: 'Computer Science & Engineering', designation: 'Professor & HOD', specialization: 'Distributed Systems', maxWeeklyHours: 8 },
];

export const MOCK_ROOMS: Room[] = [
  { id: 'room-lh201', code: 'LH-201', name: 'Turing Lecture Hall', type: 'classroom', capacity: 70, building: 'CS Academic Block', floor: 2, hasProjector: true, isAvailable: true },
  { id: 'room-lh202', code: 'LH-202', name: 'Dijkstra Lecture Hall', type: 'classroom', capacity: 70, building: 'CS Academic Block', floor: 2, hasProjector: true, isAvailable: true },
  { id: 'room-lab301', code: 'LAB-301', name: 'Systems & Networking Lab', type: 'lab', capacity: 65, building: 'CS Academic Block', floor: 3, hasProjector: true, isAvailable: true },
  { id: 'room-lab302', code: 'LAB-302', name: 'Database & Web Tech Lab', type: 'lab', capacity: 65, building: 'CS Academic Block', floor: 3, hasProjector: true, isAvailable: true },
  { id: 'room-aud1', code: 'AUD-01', name: 'Sir M.V. Seminar Auditorium', type: 'seminar', capacity: 150, building: 'Administrative Block', floor: 1, hasProjector: true, isAvailable: true },
];

export const MOCK_ALLOCATIONS: FacultyAllocation[] = [
  { id: 'alloc-1', facultyId: 'fac-104', subjectId: 'sub-cs301', sectionId: 'sec-cse-5a', academicYear: '2026-2027', semester: 5 },
  { id: 'alloc-2', facultyId: 'fac-102', subjectId: 'sub-cs302', sectionId: 'sec-cse-5a', academicYear: '2026-2027', semester: 5 },
  { id: 'alloc-3', facultyId: 'fac-103', subjectId: 'sub-cs303', sectionId: 'sec-cse-5a', academicYear: '2026-2027', semester: 5 },
  { id: 'alloc-4', facultyId: 'fac-105', subjectId: 'sub-cs304', sectionId: 'sec-cse-5a', academicYear: '2026-2027', semester: 5 },
  { id: 'alloc-5', facultyId: 'fac-105', subjectId: 'sub-cs305l', sectionId: 'sec-cse-5a', academicYear: '2026-2027', semester: 5 },
  { id: 'alloc-6', facultyId: 'fac-102', subjectId: 'sub-cs306l', sectionId: 'sec-cse-5a', academicYear: '2026-2027', semester: 5 },
  { id: 'alloc-7', facultyId: 'fac-106', subjectId: 'sub-cs307', sectionId: 'sec-cse-5a', academicYear: '2026-2027', semester: 5 },
];

// Student Semester 5 Marks Dataset (College Grading Scale)
export const MOCK_STUDENT_MARKS: SubjectMarks[] = [
  { id: 'mrk-1', studentId: 'user-std-001', subjectId: 'sub-cs301', subjectCode: 'CS301', subjectName: 'Advanced Data Structures & Algorithms', semester: 5, credits: 4, cie1: 46, cie2: 44, assignmentMarks: 18, totalCie: 45, seeMarks: 88, totalMarks: 89, grade: 'A+', gradePoint: 9.0, status: 'PASS' },
  { id: 'mrk-2', studentId: 'user-std-001', subjectId: 'sub-cs302', subjectCode: 'CS302', subjectName: 'Database Management Systems', semester: 5, credits: 4, cie1: 45, cie2: 43, assignmentMarks: 19, totalCie: 44, seeMarks: 86, totalMarks: 87, grade: 'A+', gradePoint: 9.0, status: 'PASS' },
  { id: 'mrk-3', studentId: 'user-std-001', subjectId: 'sub-cs303', subjectCode: 'CS303', subjectName: 'Computer Networks & Security', semester: 5, credits: 3, cie1: 38, cie2: 40, assignmentMarks: 16, totalCie: 39, seeMarks: 76, totalMarks: 77, grade: 'B+', gradePoint: 8.0, status: 'PASS' },
  { id: 'mrk-4', studentId: 'user-std-001', subjectId: 'sub-cs304', subjectCode: 'CS304', subjectName: 'Operating Systems & System Programming', semester: 5, credits: 4, cie1: 42, cie2: 44, assignmentMarks: 18, totalCie: 43, seeMarks: 84, totalMarks: 85, grade: 'A', gradePoint: 8.5, status: 'PASS' },
  { id: 'mrk-5', studentId: 'user-std-001', subjectId: 'sub-cs305l', subjectCode: 'CS305L', subjectName: 'Operating Systems & Networks Lab', semester: 5, credits: 2, cie1: 24, cie2: 24, assignmentMarks: 20, labMarks: 24, totalCie: 48, seeMarks: 47, totalMarks: 95, grade: 'O', gradePoint: 10.0, status: 'PASS' },
  { id: 'mrk-6', studentId: 'user-std-001', subjectId: 'sub-cs306l', subjectCode: 'CS306L', subjectName: 'DBMS & Web Technologies Lab', semester: 5, credits: 2, cie1: 23, cie2: 23, assignmentMarks: 19, labMarks: 23, totalCie: 46, seeMarks: 46, totalMarks: 92, grade: 'O', gradePoint: 10.0, status: 'PASS' },
  { id: 'mrk-7', studentId: 'user-std-001', subjectId: 'sub-cs307', subjectCode: 'CS307', subjectName: 'Software Engineering & Agile Methodologies', semester: 5, credits: 3, cie1: 41, cie2: 43, assignmentMarks: 17, totalCie: 42, seeMarks: 80, totalMarks: 82, grade: 'A', gradePoint: 8.5, status: 'PASS' },
];

export const DEFAULT_TIMETABLE_CONFIG: TimetableConfig = {
  academicDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  startTime: '08:30',
  theoryDurationMinutes: 60,
  labDurationMinutes: 150,
  breakAfterTheoryMinutes: 10,
  fridayLabOnly: true,
  lunchStartTime: '12:40',
  lunchDurationMinutes: 50,
  maxDailyHoursPerFaculty: 5,
};

// Published timetable slots
export const MOCK_PUBLISHED_TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: 'slot-mon-1', day: 'Monday', startTime: '08:30', endTime: '09:30', subjectId: 'sub-cs301', facultyId: 'fac-104', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-mon-2', day: 'Monday', startTime: '09:30', endTime: '10:30', subjectId: 'sub-cs302', facultyId: 'fac-102', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-mon-3', day: 'Monday', startTime: '10:40', endTime: '13:10', subjectId: 'sub-cs305l', facultyId: 'fac-105', roomId: 'room-lab301', sectionId: 'sec-cse-5a', isLab: true, version: 'v2.1', isPublished: true },
  { id: 'slot-mon-4', day: 'Monday', startTime: '14:00', endTime: '15:00', subjectId: 'sub-cs303', facultyId: 'fac-103', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },

  // Tuesday
  { id: 'slot-tue-1', day: 'Tuesday', startTime: '08:30', endTime: '09:30', subjectId: 'sub-cs304', facultyId: 'fac-105', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-tue-2', day: 'Tuesday', startTime: '09:30', endTime: '10:30', subjectId: 'sub-cs301', facultyId: 'fac-104', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-tue-3', day: 'Tuesday', startTime: '10:40', endTime: '11:40', subjectId: 'sub-cs307', facultyId: 'fac-106', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-tue-4', day: 'Tuesday', startTime: '11:40', endTime: '12:40', subjectId: 'sub-cs303', facultyId: 'fac-103', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },

  // Wednesday
  { id: 'slot-wed-1', day: 'Wednesday', startTime: '08:30', endTime: '09:30', subjectId: 'sub-cs302', facultyId: 'fac-102', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-wed-2', day: 'Wednesday', startTime: '09:30', endTime: '10:30', subjectId: 'sub-cs307', facultyId: 'fac-106', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-wed-3', day: 'Wednesday', startTime: '10:40', endTime: '13:10', subjectId: 'sub-cs306l', facultyId: 'fac-102', roomId: 'room-lab302', sectionId: 'sec-cse-5a', isLab: true, version: 'v2.1', isPublished: true },

  // Thursday
  { id: 'slot-thu-1', day: 'Thursday', startTime: '08:30', endTime: '09:30', subjectId: 'sub-cs303', facultyId: 'fac-103', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-thu-2', day: 'Thursday', startTime: '09:30', endTime: '10:30', subjectId: 'sub-cs304', facultyId: 'fac-105', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-thu-3', day: 'Thursday', startTime: '10:40', endTime: '11:40', subjectId: 'sub-cs301', facultyId: 'fac-104', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-thu-4', day: 'Thursday', startTime: '11:40', endTime: '12:40', subjectId: 'sub-cs302', facultyId: 'fac-102', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },

  // Friday (Dedicated Lab Day)
  { id: 'slot-fri-1', day: 'Friday', startTime: '08:30', endTime: '11:00', subjectId: 'sub-cs305l', facultyId: 'fac-105', roomId: 'room-lab301', sectionId: 'sec-cse-5a', isLab: true, version: 'v2.1', isPublished: true },
  { id: 'slot-fri-2', day: 'Friday', startTime: '11:10', endTime: '12:10', subjectId: 'sub-cs304', facultyId: 'fac-105', roomId: 'room-lh201', sectionId: 'sec-cse-5a', isLab: false, version: 'v2.1', isPublished: true },
  { id: 'slot-fri-3', day: 'Friday', startTime: '13:00', endTime: '15:30', subjectId: 'sub-cs306l', facultyId: 'fac-102', roomId: 'room-lab302', sectionId: 'sec-cse-5a', isLab: true, version: 'v2.1', isPublished: true },
];

export const MOCK_ATTENDANCE_COUNTS: Record<string, { attended: number; total: number }> = {
  'sub-cs301': { attended: 28, total: 32 }, // 87.5%
  'sub-cs302': { attended: 24, total: 30 }, // 80.0%
  'sub-cs303': { attended: 18, total: 26 }, // 69.2% (Deficit warning)
  'sub-cs304': { attended: 25, total: 31 }, // 80.6%
  'sub-cs305l': { attended: 11, total: 12 }, // 91.7%
  'sub-cs306l': { attended: 10, total: 12 }, // 83.3%
  'sub-cs307': { attended: 22, total: 25 }, // 88.0%
};

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { id: 'att-1', studentId: 'user-std-001', subjectId: 'sub-cs301', sectionId: 'sec-cse-5a', date: '2026-10-28', status: 'present', sessionTitle: 'Graph Traversal & Shortest Path' },
  { id: 'att-2', studentId: 'user-std-001', subjectId: 'sub-cs301', sectionId: 'sec-cse-5a', date: '2026-10-26', status: 'present', sessionTitle: 'B-Trees & Indexing structures' },
  { id: 'att-3', studentId: 'user-std-001', subjectId: 'sub-cs301', sectionId: 'sec-cse-5a', date: '2026-10-24', status: 'absent', remarks: 'Medical leave submitted', sessionTitle: 'Red-Black Trees Deletion' },
  { id: 'att-4', studentId: 'user-std-001', subjectId: 'sub-cs302', sectionId: 'sec-cse-5a', date: '2026-10-28', status: 'present', sessionTitle: 'ACID Properties & Isolation Levels' },
  { id: 'att-5', studentId: 'user-std-001', subjectId: 'sub-cs303', sectionId: 'sec-cse-5a', date: '2026-10-27', status: 'absent', remarks: 'Unexcused', sessionTitle: 'TCP Flow & Congestion Control' },
  { id: 'att-6', studentId: 'user-std-001', subjectId: 'sub-cs303', sectionId: 'sec-cse-5a', date: '2026-10-24', status: 'absent', remarks: 'Late arrival', sessionTitle: 'Sliding Window Protocols' },
];

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 'asmt-001',
    title: 'CIE Quiz 2: Tree Traversals, AVL Trees & Dijkstra Algorithm',
    subjectId: 'sub-cs301',
    sectionId: 'sec-cse-5a',
    type: 'quiz',
    totalMarks: 20,
    durationMinutes: 15,
    deadline: '2026-11-05T23:59:00Z',
    instructions: 'Timed university continuous internal evaluation quiz. 4 objective conceptual questions.',
    isPublished: true,
    createdAt: '2026-10-20',
    hasPyqReference: true,
    questions: [
      {
        id: 'q1',
        text: 'What is the worst-case time complexity of searching an element in an AVL tree with n nodes?',
        type: 'mcq',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
        marks: 5,
        explanation: 'AVL trees strictly maintain |h_left - h_right| <= 1, guaranteeing O(log n) worst-case search.',
      },
      {
        id: 'q2',
        text: 'Which graph traversal algorithm uses a First-In-First-Out (FIFO) queue data structure?',
        type: 'mcq',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Dijkstra’s Algorithm', 'Kruskal’s Algorithm'],
        correctAnswer: 1,
        marks: 5,
        explanation: 'BFS explores vertices level by level using a FIFO queue.',
      },
      {
        id: 'q3',
        text: 'In a red-black tree, what is the required color of the root node according to standard invariant rules?',
        type: 'mcq',
        options: ['Red', 'Black', 'Either Red or Black', 'Double Black'],
        correctAnswer: 1,
        marks: 5,
        explanation: 'Property 2 of Red-Black Trees requires the root node to always be Black.',
      },
      {
        id: 'q4',
        text: 'What is the time complexity of Dijkstra’s single-source shortest path algorithm using a Min-Heap for a graph with V vertices and E edges?',
        type: 'mcq',
        options: ['O(V^2)', 'O(E + V log V)', 'O((V + E) log V)', 'O(V * E)'],
        correctAnswer: 2,
        marks: 5,
        explanation: 'Using an adjacency list and binary min-heap, Dijkstra runs in O((V + E) log V) time.',
      },
    ],
  },
  {
    id: 'asmt-002',
    title: 'Mid-Term Exam 1: Relational Algebra & SQL Normalization',
    subjectId: 'sub-cs302',
    sectionId: 'sec-cse-5a',
    type: 'midterm',
    totalMarks: 50,
    durationMinutes: 90,
    deadline: '2026-10-15T12:00:00Z',
    instructions: 'Comprehensive mid-term evaluation covering ER Modeling, 1NF to BCNF Normalization, and SQL Queries.',
    isPublished: true,
    createdAt: '2026-10-01',
    hasPyqReference: true,
    questions: [],
  },
];

export const MOCK_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'subm-001',
    assessmentId: 'asmt-002',
    studentId: 'user-std-001',
    submittedAt: '2026-10-15T11:42:00Z',
    score: 44,
    totalMarks: 50,
    status: 'graded',
    answers: {},
    feedback: 'Excellent breakdown of BCNF decomposition. Well-structured query projections.',
  },
];

export const MOCK_PYQS: PreviousYearPaper[] = [
  { id: 'pyq-01', subjectId: 'sub-cs301', subjectCode: 'CS301', subjectName: 'Advanced Data Structures & Algorithms', year: 2025, semester: 5, examType: 'End Semester', fileSize: '2.4 MB', downloadUrl: '#' },
  { id: 'pyq-02', subjectId: 'sub-cs302', subjectCode: 'CS302', subjectName: 'Database Management Systems', year: 2025, semester: 5, examType: 'End Semester', fileSize: '3.1 MB', downloadUrl: '#' },
  { id: 'pyq-03', subjectId: 'sub-cs303', subjectCode: 'CS303', subjectName: 'Computer Networks & Security', year: 2025, semester: 5, examType: 'Mid-Term 1', fileSize: '1.5 MB', downloadUrl: '#' },
  { id: 'pyq-04', subjectId: 'sub-cs304', subjectCode: 'CS304', subjectName: 'Operating Systems & System Programming', year: 2025, semester: 5, examType: 'End Semester', fileSize: '2.8 MB', downloadUrl: '#' },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'anc-1', title: 'Semester 5 Continuous Internal Evaluation (CIE-2) Schedule', content: 'CIE-2 will commence from November 18, 2026. Hall tickets will be issued only to candidates with minimum 75% attendance.', category: 'Examination', date: '2026-10-28', author: 'Dean of Academic Affairs', isImportant: true },
  { id: 'anc-2', title: 'Campus Placement Drive: Top Tier Tech Companies', content: 'Pre-placement talk for CSE Semester 5 & 7 students by Google Cloud and Microsoft Engineering team on Nov 4, 3:00 PM at Main Auditorium.', category: 'Placement', date: '2026-10-27', author: 'Placement Cell' },
  { id: 'anc-3', title: 'Official Timetable Release: Version 2.1 Live', content: 'Fall Semester timetable version 2.1 published by HOD CSE. Friday dedicated laboratory schedule active.', category: 'Academic', date: '2026-09-15', author: 'HOD CSE' },
  { id: 'anc-4', title: 'HackCSE 2026: 36-Hour College Hackathon', content: 'Registrations are open for the annual departmental hackathon. Themes include AI in Education, Distributed Cloud, and FinTech.', category: 'Events', date: '2026-10-22', author: 'CSE Association' },
];

export const MOCK_CLUBS: CollegeClub[] = [
  { id: 'clb-1', name: 'ACM Student Chapter', category: 'Coding', description: 'Premier computer science chapter organizing competitive coding contests, algorithmic workshops, and open source hack nights.', leadName: 'Karthik S.', facultyAdvisor: 'Dr. Rajesh Kumar', memberCount: 142, meetingSchedule: 'Every Wednesday 4:30 PM, LAB-301', isJoined: true, role: 'Active Member' },
  { id: 'clb-2', name: 'IEEE Computer Society', category: 'Technical', description: 'Technical paper presentations, research paper reading groups, and guest talks by industry scientists.', leadName: 'Ananya Iyer', facultyAdvisor: 'Dr. S. Ramanujan', memberCount: 118, meetingSchedule: 'Alternate Fridays 4:00 PM, AUD-01', isJoined: false },
  { id: 'clb-3', name: 'Robotics & Embedded AI Club', category: 'Robotics', description: 'Hands-on hardware lab for building autonomous rovers, drones, and edge-computing sensor networks.', leadName: 'Rohan Das', facultyAdvisor: 'Prof. Kevin Scott', memberCount: 76, meetingSchedule: 'Saturdays 10:00 AM, MakerSpace', isJoined: false },
  { id: 'clb-4', name: 'Rotaract Youth Club', category: 'Social', description: 'Community outreach, blood donation drives, environmental cleanups, and rural education volunteering.', leadName: 'Sneha Roy', facultyAdvisor: 'Prof. Anita Sharma', memberCount: 95, meetingSchedule: 'Every 2nd Saturday 2:00 PM', isJoined: true, role: 'Volunteer' },
  { id: 'clb-5', name: 'Choreography & Cultural Guild', category: 'Cultural', description: 'Official collegiate music, dance, and theatrical production society participating in university festivals.', leadName: 'Vikram Malhotra', facultyAdvisor: 'Dr. Deepa Krishnan', memberCount: 88, meetingSchedule: 'Tuesdays & Thursdays 5:00 PM', isJoined: false },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  { id: 'cmp-1', studentId: 'user-std-001', studentName: 'Aarav Sharma', subject: 'High-speed internet disconnection in LAB-302 workstation rows 4-6', category: 'Laboratory', description: 'The Ethernet drops constantly during database queries and Docker container pull operations.', status: 'in_progress', createdAt: '2026-10-25', isAnonymous: false, resolutionNote: 'Network team replaced the 24-port switch on Oct 28. Testing packet latency.' },
  { id: 'cmp-2', studentId: 'user-std-001', studentName: 'Aarav Sharma', subject: 'LH-201 Projector HDMI audio desync', category: 'Infrastructure', description: 'Audio crackles and cuts out during video demonstrations in lecture hours.', status: 'resolved', createdAt: '2026-10-18', isAnonymous: false, resolutionNote: 'Replaced HDMI extender and audio DAC on Oct 20.' },
];

export const MOCK_ALUMNI: AlumniProfile[] = [
  { id: 'alm-1', name: 'Aditi Rao', degree: 'B.Tech CSE (Batch of 2022)', graduationYear: 2022, department: 'Computer Science & Engineering', currentCompany: 'Google India', currentRole: 'Software Engineer III (Search Infrastructure)', location: 'Bengaluru, India', linkedinUrl: 'https://linkedin.com', email: 'aditi.rao.alum@gmail.com', isMentorAvailable: true },
  { id: 'alm-2', name: 'Siddharth Nair', degree: 'B.Tech CSE (Batch of 2021)', graduationYear: 2021, department: 'Computer Science & Engineering', currentCompany: 'Amazon Web Services', currentRole: 'Cloud Solutions Architect', location: 'Seattle, WA, USA', linkedinUrl: 'https://linkedin.com', email: 'sid.nair@aws.com', isMentorAvailable: true },
  { id: 'alm-3', name: 'Meera Nambiar', degree: 'B.Tech CSE (Batch of 2023)', graduationYear: 2023, department: 'Computer Science & Engineering', currentCompany: 'Microsoft R&D', currentRole: 'Machine Learning Engineer', location: 'Hyderabad, India', linkedinUrl: 'https://linkedin.com', email: 'meera.nambiar@microsoft.com', isMentorAvailable: false },
  { id: 'alm-4', name: 'Varun Kulkarni', degree: 'B.Tech CSE (Batch of 2020)', graduationYear: 2020, department: 'Computer Science & Engineering', currentCompany: 'Stripe', currentRole: 'Staff Infrastructure Engineer', location: 'San Francisco, CA', linkedinUrl: 'https://linkedin.com', email: 'varun.k@stripe.com', isMentorAvailable: true },
];

export const MOCK_DEPARTMENT_EVENTS: DepartmentEvent[] = [
  { id: 'ev-1', title: 'Hands-on Workshop: Microservices with Go and Kubernetes', type: 'Workshop', description: 'Full day industrial workshop on cloud native architectures, container orchestrations, and service meshes.', eventDate: '2026-11-12', time: '09:00 AM - 04:30 PM', venue: 'LAB-301 & LAB-302', coordinator: 'Prof. Kevin Scott', participantsCount: 85 },
  { id: 'ev-2', title: 'International Conference on Distributed Computing & AI (ICDCAI 2026)', type: 'Conference', description: 'Peer-reviewed conference with IEEE proceedings. Keynotes by leading academic researchers.', eventDate: '2026-12-05', time: '09:30 AM - 05:00 PM', venue: 'Sir M.V. Seminar Auditorium', coordinator: 'Dr. Meenakshi Sundaram', participantsCount: 220 },
  { id: 'ev-3', title: 'Guest Lecture: Cryptographic Protocols in Post-Quantum Computing', type: 'Guest Lecture', description: 'Dr. Bruce Schneier research fellow delivering talk on lattice-based cryptography standards.', eventDate: '2026-11-20', time: '02:00 PM - 04:00 PM', venue: 'Turing Hall LH-201', coordinator: 'Dr. S. Ramanujan', participantsCount: 110 },
];

export const MOCK_STUDENTS = [
  { id: 'user-std-001', rollNo: '1CS23CS001', name: 'Aarav Sharma', email: 'aarav.sharma@college.edu', sectionId: 'sec-cse-5a' },
  { id: 'user-std-002', rollNo: '1CS23CS002', name: 'Samantha Vance', email: 'samantha.v@college.edu', sectionId: 'sec-cse-5a' },
  { id: 'user-std-003', rollNo: '1CS23CS003', name: 'Devon Miller', email: 'devon.m@college.edu', sectionId: 'sec-cse-5a' },
  { id: 'user-std-004', rollNo: '1CS23CS004', name: 'Priya Sharma', email: 'priya.s@college.edu', sectionId: 'sec-cse-5a' },
  { id: 'user-std-005', rollNo: '1CS23CS005', name: 'Marcus Brody', email: 'marcus.b@college.edu', sectionId: 'sec-cse-5a' },
  { id: 'user-std-006', rollNo: '1CS23CS006', name: 'Chloe Dubois', email: 'chloe.d@college.edu', sectionId: 'sec-cse-5a' },
  { id: 'user-std-007', rollNo: '1CS23CS007', name: 'Arjun Nair', email: 'arjun.n@college.edu', sectionId: 'sec-cse-5a' },
  { id: 'user-std-008', rollNo: '1CS23CS008', name: 'Elena Rostova', email: 'elena.r@college.edu', sectionId: 'sec-cse-5a' },
];

export const MOCK_FACULTY_FEEDBACK: FacultyFeedbackRecord[] = [
  {
    id: 'fb-01',
    facultyId: 'fac-104',
    facultyName: 'Dr. Rajesh Kumar',
    subjectId: 'sub-cs301',
    subjectName: 'Advanced Data Structures & Algorithms',
    submittedAt: '2026-09-18T10:00:00Z',
    comments: 'Request to swap Thursday period 3 with Friday lab preparation.',
    ratingClarity: 5,
    ratingKnowledge: 5,
    ratingPunctuality: 5,
    ratingFairness: 5,
    ratings: { clarity: 5, knowledge: 5, punctuality: 5, fairness: 5 },
    overallRating: 5,
  },
];
