import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  LineChart,
  Users,
  Award,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { SubjectMarks, Subject } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

interface StudentPerformanceRecord {
  id: string;
  usn: string;
  name: string;
  section: string;
  cie1: number; // max 30
  cie2: number; // max 30
  attendanceRate: number; // percentage
  status: 'good' | 'average' | 'at_risk';
  predictedGrade: string;
}

const SAMPLE_SECTION_STUDENTS: StudentPerformanceRecord[] = [
  { id: 'std-1', usn: '1CS23CS001', name: 'Alex Johnson', section: '5-A', cie1: 27, cie2: 28, attendanceRate: 88.5, status: 'good', predictedGrade: 'A+' },
  { id: 'std-2', usn: '1CS23CS002', name: 'Samantha Vance', section: '5-A', cie1: 29, cie2: 29, attendanceRate: 94.0, status: 'good', predictedGrade: 'O' },
  { id: 'std-3', usn: '1CS23CS003', name: 'Devon Miller', section: '5-A', cie1: 14, cie2: 12, attendanceRate: 64.2, status: 'at_risk', predictedGrade: 'F / Re-eval' },
  { id: 'std-4', usn: '1CS23CS004', name: 'Priya Sharma', section: '5-A', cie1: 25, cie2: 24, attendanceRate: 82.0, status: 'good', predictedGrade: 'A' },
  { id: 'std-5', usn: '1CS23CS005', name: 'Marcus Brody', section: '5-A', cie1: 18, cie2: 19, attendanceRate: 72.5, status: 'at_risk', predictedGrade: 'B' },
  { id: 'std-6', usn: '1CS23CS006', name: 'Chloe Dubois', section: '5-A', cie1: 26, cie2: 27, attendanceRate: 91.0, status: 'good', predictedGrade: 'A+' },
  { id: 'std-7', usn: '1CS23CS007', name: 'Arjun Nair', section: '5-A', cie1: 22, cie2: 23, attendanceRate: 78.0, status: 'average', predictedGrade: 'B+' },
  { id: 'std-8', usn: '1CS23CS008', name: 'Elena Rostova', section: '5-A', cie1: 13, cie2: 16, attendanceRate: 68.0, status: 'at_risk', predictedGrade: 'C' },
];

export const FacultyPerformance: React.FC = () => {
  const toast = useToast();
  const [students, setStudents] = useState<StudentPerformanceRecord[]>(SAMPLE_SECTION_STUDENTS);
  const [selectedSubject, setSelectedSubject] = useState('CS501');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const atRiskCount = students.filter(s => s.status === 'at_risk').length;
  const avgAttendance = (
    students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length
  ).toFixed(1);

  const handleIssueNotice = (studentName: string) => {
    toast.success(`Remedial counseling notice sent to ${studentName} & Proctor.`);
  };

  const handleExportRoster = () => {
    toast.success('Section 5-A Performance & Internal Marks sheet exported (CSV).');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Academic Performance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous Internal Evaluation (CIE), test averages, and attendance risk telemetry for your courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="CS501">CS501 - Database Systems (Sec 5-A)</option>
            <option value="CS504">CS504 - Operating Systems (Sec 5-B)</option>
          </select>

          <Button variant="outline" size="sm" onClick={handleExportRoster}>
            <Download className="w-4 h-4 mr-1.5" />
            Export Marks
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrolled Students"
          value={students.length}
          subtitle="Section 5-A B.Tech CSE"
          icon={<Users className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          title="Average Attendance"
          value={`${avgAttendance}%`}
          subtitle="Semester 5 benchmark"
          icon={<LineChart className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          title="Class Average (CIE-1)"
          value="21.6 / 30"
          subtitle="72.0% Mean score"
          icon={<Award className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          title="At-Risk Students"
          value={atRiskCount}
          subtitle="Attendance <75% or CIE <15"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name or USN (e.g. 1CS23CS001)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs w-full sm:w-auto">
          {(['all', 'good', 'average', 'at_risk'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-md capitalize font-medium cursor-pointer transition-colors ${
                filterStatus === s ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Students Performance Table */}
      <Card className="overflow-x-auto">
        <CardContent className="p-0">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="p-3">USN</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Section</th>
                <th className="p-3">CIE-1 (30)</th>
                <th className="p-3">CIE-2 (30)</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Predicted Grade</th>
                <th className="p-3">Risk Status</th>
                <th className="p-3 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-semibold text-slate-800">{student.usn}</td>
                  <td className="p-3 font-medium text-slate-900">{student.name}</td>
                  <td className="p-3 text-slate-600">{student.section}</td>
                  <td className="p-3 font-mono font-semibold text-slate-700">{student.cie1}/30</td>
                  <td className="p-3 font-mono font-semibold text-slate-700">{student.cie2}/30</td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        student.attendanceRate < 75 ? 'text-amber-700 font-bold' : 'text-emerald-700'
                      }`}
                    >
                      {student.attendanceRate}%
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge variant={student.predictedGrade === 'O' ? 'teal' : student.predictedGrade.includes('F') ? 'danger' : 'info'}>
                      {student.predictedGrade}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {student.status === 'at_risk' ? (
                      <Badge variant="danger">At Risk</Badge>
                    ) : student.status === 'average' ? (
                      <Badge variant="warning">Moderate</Badge>
                    ) : (
                      <Badge variant="success">On Track</Badge>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {student.status === 'at_risk' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] py-1 border-amber-300 text-amber-800 hover:bg-amber-50"
                        onClick={() => handleIssueNotice(student.name)}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Remedial Notice
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
