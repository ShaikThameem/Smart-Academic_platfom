import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Award, BookOpen, CheckCircle2, Download, Printer } from 'lucide-react';
import { academicService } from '../../services/academicService';
import { SubjectMarks } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const StudentMarks: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [marks, setMarks] = useState<SubjectMarks[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMarks() {
      try {
        setIsLoading(true);
        const data = await academicService.getStudentMarks(user.id);
        setMarks(data);
      } catch (err) {
        console.error('Failed to load marks', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMarks();
  }, [user]);

  const totalCredits = marks.reduce((sum, m) => sum + m.credits, 0);
  const totalGradePoints = marks.reduce((sum, m) => sum + (m.gradePoint * m.credits), 0);
  const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '8.84';

  const handleExportMarksheet = () => {
    toast.success('Official Semester 5 Grade Card PDF generated for download.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
              Examination & Grading Records
            </span>
            <Badge variant="success" size="sm">
              All Results Verified
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Marks & Cumulative Grade Cards
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            USN: <strong className="font-mono text-slate-700">{user.codeNumber}</strong> · Semester 5 · B.Tech Computer Science & Engineering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Printer className="w-3.5 h-3.5" />} onClick={() => window.print()}>
            Print
          </Button>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={handleExportMarksheet}>
            Export Grade Card
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Semester SGPA"
          value={sgpa}
          subtitle="Based on 22 registered credits"
          icon={<Award className="w-5 h-5" />}
          iconBg="bg-teal-50 text-teal-600"
          badge={<Badge variant="success" size="sm">Distinction</Badge>}
        />

        <StatCard
          title="Cumulative CGPA"
          value="8.84"
          subtitle="Across Semesters 1 to 5"
          icon={<Award className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Credits Registered"
          value={`${totalCredits} Credits`}
          subtitle="100% course clearance rate"
          icon={<BookOpen className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Academic Standing"
          value="PASS"
          subtitle="0 Backlogs / Arrears"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          badge={<Badge variant="success" size="sm">Regular</Badge>}
        />
      </div>

      {/* Detailed Subject Marks Table */}
      <Card>
        <CardHeader
          title="Semester 5 Subject Marks & Grade Breakdown"
          subtitle="CIE (Continuous Internal Evaluation) + SEE (Semester End Examination) Scheme"
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Select Semester:</span>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(Number(e.target.value))}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
              >
                <option value={5}>Semester 5 (Active Fall 2026)</option>
                <option value={4}>Semester 4 (Spring 2026 - 8.78 SGPA)</option>
                <option value={3}>Semester 3 (Fall 2025 - 8.90 SGPA)</option>
                <option value={2}>Semester 2 (Spring 2025 - 8.85 SGPA)</option>
                <option value={1}>Semester 1 (Fall 2024 - 8.80 SGPA)</option>
              </select>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Subject Code & Course</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">CIE-1 (50)</th>
                <th className="py-3 px-4">CIE-2 (50)</th>
                <th className="py-3 px-4">Total CIE (50)</th>
                <th className="py-3 px-4">SEE (100)</th>
                <th className="py-3 px-4">Total (100)</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4 text-right">Grade Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marks.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 block text-sm">{m.subjectName}</span>
                    <span className="font-mono text-teal-600 font-bold">{m.subjectCode}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{m.credits}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{m.cie1}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{m.cie2}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{m.totalCie}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{m.seeMarks || '—'}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-700 text-sm">{m.totalMarks}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={m.grade === 'O' || m.grade === 'A+' ? 'success' : 'neutral'} size="sm">
                      {m.grade}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold font-mono text-slate-900">
                    {m.gradePoint.toFixed(1)}
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
