import React, { useState } from 'react';
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
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface HodStudentRecord {
  id: string;
  usn: string;
  name: string;
  semester: number;
  section: string;
  cgpa: number;
  attendanceAvg: number;
  backlogs: number;
  status: 'good' | 'average' | 'critical';
}

const DEPARTMENT_STUDENTS: HodStudentRecord[] = [
  { id: '1', usn: '1CS23CS001', name: 'Alex Johnson', semester: 5, section: '5-A', cgpa: 8.72, attendanceAvg: 88.5, backlogs: 0, status: 'good' },
  { id: '2', usn: '1CS23CS002', name: 'Samantha Vance', semester: 5, section: '5-A', cgpa: 9.45, attendanceAvg: 94.0, backlogs: 0, status: 'good' },
  { id: '3', usn: '1CS23CS003', name: 'Devon Miller', semester: 5, section: '5-A', cgpa: 6.12, attendanceAvg: 64.2, backlogs: 2, status: 'critical' },
  { id: '4', usn: '1CS23CS004', name: 'Priya Sharma', semester: 5, section: '5-A', cgpa: 8.40, attendanceAvg: 82.0, backlogs: 0, status: 'good' },
  { id: '5', usn: '1CS23CS005', name: 'Marcus Brody', semester: 5, section: '5-A', cgpa: 7.20, attendanceAvg: 72.5, backlogs: 1, status: 'average' },
  { id: '6', usn: '1CS23CS006', name: 'Chloe Dubois', semester: 5, section: '5-B', cgpa: 9.10, attendanceAvg: 91.0, backlogs: 0, status: 'good' },
  { id: '7', usn: '1CS23CS007', name: 'Arjun Nair', semester: 5, section: '5-B', cgpa: 7.85, attendanceAvg: 78.0, backlogs: 0, status: 'average' },
  { id: '8', usn: '1CS23CS008', name: 'Elena Rostova', semester: 5, section: '5-B', cgpa: 6.45, attendanceAvg: 68.0, backlogs: 1, status: 'critical' },
];

export const HodStudentPerformance: React.FC = () => {
  const toast = useToast();
  const [students] = useState<HodStudentRecord[]>(DEPARTMENT_STUDENTS);
  const [semesterFilter, setSemesterFilter] = useState('5');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const avgCgpa = (students.reduce((a, b) => a + b.cgpa, 0) / students.length).toFixed(2);
  const criticalCount = students.filter(s => s.status === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Department Student Performance & Progression
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic academic monitoring across B.Tech batches, CGPA distribution, and credit audit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Dean Academic Report exported (PDF).')}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Active Students"
          value="480"
          subtitle="UG CSE Batches (Sem 1-8)"
          icon={<Users className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          title="Department Average CGPA"
          value={`${avgCgpa} / 10`}
          subtitle="78.2% First Class rate"
          icon={<GraduationCap className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          title="Graduation Rate"
          value="96.4%"
          subtitle="Target exceeded by 2.4%"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Intervention Required"
          value={criticalCount}
          subtitle="Backlogs > 1 or Attendance < 70%"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name or USN..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          {(['all', 'good', 'average', 'critical'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md capitalize font-medium cursor-pointer transition-colors ${
                statusFilter === s ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Roster Table */}
      <Card className="overflow-x-auto">
        <CardContent className="p-0">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="p-3">USN</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Semester</th>
                <th className="p-3">Section</th>
                <th className="p-3">Cumulative CGPA</th>
                <th className="p-3">Avg Attendance</th>
                <th className="p-3">Active Backlogs</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Dean Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-semibold text-slate-800">{s.usn}</td>
                  <td className="p-3 font-medium text-slate-900">{s.name}</td>
                  <td className="p-3 text-slate-600">Sem {s.semester}</td>
                  <td className="p-3 text-slate-600">{s.section}</td>
                  <td className="p-3 font-mono font-bold text-teal-800">{s.cgpa}</td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        s.attendanceAvg < 75 ? 'text-amber-700 font-bold' : 'text-emerald-700'
                      }`}
                    >
                      {s.attendanceAvg}%
                    </span>
                  </td>
                  <td className="p-3 font-mono">
                    {s.backlogs > 0 ? (
                      <span className="text-rose-600 font-bold">{s.backlogs}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="p-3">
                    {s.status === 'critical' ? (
                      <Badge variant="danger">Critical</Badge>
                    ) : s.status === 'average' ? (
                      <Badge variant="warning">Monitor</Badge>
                    ) : (
                      <Badge variant="success">Exemplary</Badge>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] py-1"
                      onClick={() => toast.success(`Proctor conference requested for ${s.name}.`)}
                    >
                      Proctor Review
                    </Button>
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
