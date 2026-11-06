import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import {
  FileText,
  Download,
  Filter,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Users,
  BarChart3,
  Search,
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { academicService } from '../../services/academicService';
import { Section, Subject } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const HodReports: React.FC = () => {
  const toast = useToast();

  const [defaulters, setDefaulters] = useState<any[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [defs, secList, subList] = await Promise.all([
          attendanceService.getAttendanceDefaulters(),
          academicService.getSections(),
          academicService.getSubjects(),
        ]);
        setDefaulters(defs);
        setSections(secList);
        setSubjects(subList);
      } catch (err) {
        console.error('Failed to load academic reports', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportCSV = () => {
    toast.success('Generated official Attendance Defaulters Report CSV for University Registrar compliance.');
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredDefaulters = defaulters.filter(d => {
    if (selectedSection !== 'all' && d.section !== selectedSection) return false;
    if (selectedSubject !== 'all' && d.subjectCode !== selectedSubject) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && !d.rollNo.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Compliance & Attendance Audit Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify examination debarment risks, subject-wise deficit numbers, and section grade health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
          >
            Print Audit
          </Button>
          <Button
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCSV}
          >
            Export Compliance CSV
          </Button>
        </div>
      </div>

      {/* Audit KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Students Under 75%"
          value={defaulters.length}
          subtitle="Mandatory condonation or debarment"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
          badge={<Badge variant="danger" size="sm">Attention</Badge>}
        />

        <StatCard
          title="Department Average"
          value="82.4%"
          subtitle="Across 120 CSE Students"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          badge={<Badge variant="success" size="sm">Satisfactory</Badge>}
        />

        <StatCard
          title="Most Critical Course"
          value="CS303"
          subtitle="Computer Networks (69.2% median)"
          icon={<BarChart3 className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Filter and Audit Table */}
      <Card>
        <CardHeader
          title="Attendance Shortage & Examination Debarment List"
          subtitle="Students with aggregate or course-level attendance below 75% as per VTU / AICTE norms"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
              >
                <option value="all">All Sections</option>
                <option value="CSE-5A">Section CSE-5A</option>
                <option value="CSE-5B">Section CSE-5B</option>
              </select>

              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student name or USN..."
            className="w-full text-xs bg-transparent border-0 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">USN / Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Affected Course</th>
                <th className="py-3 px-4">Classes Count</th>
                <th className="py-3 px-4">Current %</th>
                <th className="py-3 px-4">Required Classes</th>
                <th className="py-3 px-4 text-right">Debarment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDefaulters.map(student => (
                <tr key={`${student.studentId}-${student.subjectCode}`} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {student.rollNo}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm">
                    {student.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{student.section}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-blue-600 font-bold mr-1">{student.subjectCode}</span>
                    <span className="text-slate-700">{student.subjectName}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {student.attended} / {student.total}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-rose-600 text-sm">{student.percentage}%</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    Must attend <strong>+{student.shortfall} classes</strong>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge variant={student.percentage < 70 ? 'danger' : 'warning'} size="sm">
                      {student.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
