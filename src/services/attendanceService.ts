import {
  AttendanceRecord,
  AttendanceStatus,
  StudentAttendanceSummary,
} from '../types/academic';
import {
  MOCK_ATTENDANCE_RECORDS,
  MOCK_ATTENDANCE_COUNTS,
  MOCK_STUDENTS,
} from './mockData';
import { academicService } from './academicService';

// In-memory store of individual attendance records
let attendanceRecordsStore: AttendanceRecord[] = [...MOCK_ATTENDANCE_RECORDS];

// Subject-level counts for student user-std-001 (Aarav)
let studentAttendanceCounts: Record<string, { attended: number; total: number }> = {
  ...MOCK_ATTENDANCE_COUNTS,
};

export const attendanceService = {
  // Student: Get real-time calculated attendance summaries
  async getStudentSummary(studentId: string = 'user-std-001'): Promise<{
    overallPercentage: number;
    totalAttended: number;
    totalClasses: number;
    subjects: StudentAttendanceSummary[];
  }> {
    const subjects = await academicService.getSubjects();

    let totalAttended = 0;
    let totalClasses = 0;

    const summaries: StudentAttendanceSummary[] = subjects.map(sub => {
      const counts = studentAttendanceCounts[sub.id] || { attended: 20, total: 24 };
      const percentage = counts.total > 0 ? (counts.attended / counts.total) * 100 : 0;
      const roundedPercent = Math.round(percentage * 10) / 10;

      totalAttended += counts.attended;
      totalClasses += counts.total;

      // Calculate classes needed to reach 75%
      // Formula: (attended + x) / (total + x) >= 0.75 => x >= (0.75 * total - attended) / 0.25
      let neededFor75 = 0;
      let canMissNext = 0;

      if (roundedPercent < 75) {
        neededFor75 = Math.max(1, Math.ceil((0.75 * counts.total - counts.attended) / 0.25));
      } else {
        // How many can miss without dropping below 75%:
        // attended / (total + y) >= 0.75 => total + y <= attended / 0.75 => y <= (attended / 0.75) - total
        canMissNext = Math.max(0, Math.floor(counts.attended / 0.75 - counts.total));
      }

      let status: 'safe' | 'warning' | 'critical' = 'safe';
      if (roundedPercent < 75) {
        status = 'critical';
      } else if (roundedPercent < 80) {
        status = 'warning';
      }

      return {
        subjectId: sub.id,
        subjectCode: sub.code,
        subjectName: sub.name,
        attended: counts.attended,
        total: counts.total,
        percentage: roundedPercent,
        status,
        neededFor75,
        canMissNext,
      };
    });

    const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 1000) / 10 : 0;

    return Promise.resolve({
      overallPercentage,
      totalAttended,
      totalClasses,
      subjects: summaries,
    });
  },

  // Student: Get detailed attendance log
  async getStudentLogs(studentId: string = 'user-std-001', subjectId?: string): Promise<AttendanceRecord[]> {
    let logs = attendanceRecordsStore.filter(r => r.studentId === studentId);
    if (subjectId) {
      logs = logs.filter(r => r.subjectId === subjectId);
    }
    // Sort descending by date
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return Promise.resolve(logs);
  },

  // Faculty: Get enrolled students roster with existing attendance status for a session
  async getSessionRoster(sectionId: string, subjectId: string, date: string): Promise<Array<{
    studentId: string;
    rollNo: string;
    name: string;
    email: string;
    status: AttendanceStatus;
    remarks?: string;
  }>> {
    const students = MOCK_STUDENTS.filter(s => s.sectionId === sectionId);
    const existingRecords = attendanceRecordsStore.filter(
      r => r.sectionId === sectionId && r.subjectId === subjectId && r.date === date
    );

    const roster = students.map(st => {
      const rec = existingRecords.find(r => r.studentId === st.id);
      return {
        studentId: st.id,
        rollNo: st.rollNo,
        name: st.name,
        email: st.email,
        status: rec ? rec.status : ('present' as AttendanceStatus),
        remarks: rec?.remarks,
      };
    });

    return Promise.resolve(roster);
  },

  // Faculty: Save session attendance batch
  async saveSessionAttendance(params: {
    sectionId: string;
    subjectId: string;
    date: string;
    sessionTitle: string;
    records: Array<{ studentId: string; status: AttendanceStatus; remarks?: string }>;
  }): Promise<{ savedCount: number; message: string }> {
    const { sectionId, subjectId, date, sessionTitle, records } = params;

    // Remove existing for that session if any (supports edit/correction)
    attendanceRecordsStore = attendanceRecordsStore.filter(
      r => !(r.sectionId === sectionId && r.subjectId === subjectId && r.date === date)
    );

    // Add updated records
    const newRecords: AttendanceRecord[] = records.map(r => ({
      id: `att-${Date.now()}-${r.studentId}`,
      studentId: r.studentId,
      subjectId,
      sectionId,
      date,
      status: r.status,
      sessionTitle,
      remarks: r.remarks,
    }));

    attendanceRecordsStore = [...newRecords, ...attendanceRecordsStore];

    // Update student-001 stats dynamically if included
    const student1Record = records.find(r => r.studentId === 'user-std-001');
    if (student1Record) {
      const current = studentAttendanceCounts[subjectId] || { attended: 0, total: 0 };
      studentAttendanceCounts[subjectId] = {
        total: current.total + 1,
        attended: current.attended + (student1Record.status === 'present' ? 1 : 0),
      };
    }

    return Promise.resolve({
      savedCount: newRecords.length,
      message: `Successfully logged attendance for ${newRecords.length} students on ${date}.`,
    });
  },

  // HOD / Admin: Get list of students below 75% (defaulters)
  async getAttendanceDefaulters(sectionId?: string) {
    const students = sectionId ? MOCK_STUDENTS.filter(s => s.sectionId === sectionId) : MOCK_STUDENTS;
    const subjects = await academicService.getSubjects();

    // Generate realistic attendance health for all section students
    const defaulters = [
      {
        studentId: 'user-std-001',
        rollNo: '1CS23CS001',
        name: 'Aarav Sharma',
        section: 'CSE-5A',
        subjectCode: 'CS303',
        subjectName: 'Computer Networks & Security',
        percentage: 69.2,
        attended: 18,
        total: 26,
        shortfall: 2,
        status: 'Critical Alert',
      },
      {
        studentId: 'user-std-005',
        rollNo: '1CS23CS005',
        name: 'Rohan Das',
        section: 'CSE-5A',
        subjectCode: 'CS304',
        subjectName: 'Operating Systems',
        percentage: 64.5,
        attended: 20,
        total: 31,
        shortfall: 4,
        status: 'Critical Alert',
      },
      {
        studentId: 'user-std-007',
        rollNo: '1CS23CS007',
        name: 'Vikram Malhotra',
        section: 'CSE-5A',
        subjectCode: 'CS302',
        subjectName: 'Database Management Systems',
        percentage: 71.0,
        attended: 22,
        total: 31,
        shortfall: 2,
        status: 'Warning Notice',
      },
      {
        studentId: 'user-std-011',
        rollNo: '1CS23CS011',
        name: 'Nikhil Joshi',
        section: 'CSE-5A',
        subjectCode: 'CS301',
        subjectName: 'Advanced Data Structures & Algorithms',
        percentage: 68.8,
        attended: 22,
        total: 32,
        shortfall: 2,
        status: 'Critical Alert',
      },
      {
        studentId: 'user-std-015',
        rollNo: '1CS23CS015',
        name: 'Chetan Deshmukh',
        section: 'CSE-5A',
        subjectCode: 'CS307',
        subjectName: 'Software Engineering',
        percentage: 72.0,
        attended: 18,
        total: 25,
        shortfall: 1,
        status: 'Warning Notice',
      },
    ];

    return Promise.resolve(defaulters);
  },
};
