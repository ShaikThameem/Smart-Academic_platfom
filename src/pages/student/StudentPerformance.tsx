import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { TrendingUp, Award, BookOpen, CheckCircle2, LineChart, ShieldCheck } from 'lucide-react';
import { academicService } from '../../services/academicService';
import { attendanceService } from '../../services/attendanceService';
import { SubjectMarks, StudentAttendanceSummary } from '../../types/academic';

export const StudentPerformance: React.FC = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState<SubjectMarks[]>([]);
  const [attendance, setAttendance] = useState<{ overallPercentage: number; subjects: StudentAttendanceSummary[] }>({
    overallPercentage: 0,
    subjects: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [mrkList, attData] = await Promise.all([
          academicService.getStudentMarks(user.id),
          attendanceService.getStudentSummary(user.id),
        ]);
        setMarks(mrkList);
        setAttendance(attData);
      } catch (err) {
        console.error('Failed to load performance metrics', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  // Semester GPA Progression Trend
  const semesterTrends = [
    { sem: 'Sem 1', sgpa: 8.80, credits: 20, remarks: 'Distinction' },
    { sem: 'Sem 2', sgpa: 8.85, credits: 20, remarks: 'Distinction' },
    { sem: 'Sem 3', sgpa: 8.90, credits: 24, remarks: 'Distinction' },
    { sem: 'Sem 4', sgpa: 8.78, credits: 24, remarks: 'Distinction' },
    { sem: 'Sem 5 (Current)', sgpa: 8.84, credits: 22, remarks: 'Active Term' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
              Undergraduate Degree Progression
            </span>
            <Badge variant="success" size="sm">
              Continuous Evaluation
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Performance & Marks Trends
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Subject-wise internal assessments, examination grades, and cumulative credit trajectory. (No public ranking/leaderboard).
          </p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cumulative CGPA"
          value="8.84"
          subtitle="Across Semesters 1 to 5"
          icon={<Award className="w-5 h-5" />}
          iconBg="bg-teal-50 text-teal-600"
          badge={<Badge variant="success" size="sm">First Class with Distinction</Badge>}
        />

        <StatCard
          title="Earned Credits"
          value="88 / 160"
          subtitle="55% of degree requirement"
          icon={<BookOpen className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Attendance Health"
          value={`${attendance.overallPercentage}%`}
          subtitle="Mandatory 75% for exam hall ticket"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          badge={<Badge variant={attendance.overallPercentage >= 75 ? 'success' : 'danger'} size="sm">{attendance.overallPercentage >= 75 ? 'Eligible' : 'Shortage'}</Badge>}
        />

        <StatCard
          title="Pass Percentage"
          value="100%"
          subtitle="0 active backlogs / arrear papers"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Semester Progression Trend & Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semester GPA History (1 Col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Semester GPA Progression"
              subtitle="Term-wise SGPA trajectory"
            />
            <CardContent className="space-y-3">
              {semesterTrends.map(t => (
                <div key={t.sem} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-900 block">{t.sem}</span>
                    <span className="text-[10px] text-slate-500">{t.credits} Credits · {t.remarks}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-teal-700">{t.sgpa.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">SGPA</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Subject-Wise Performance Breakdown (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Subject-Wise Performance & Grade Distribution"
              subtitle="Semester 5 Continuous Internal Evaluation (CIE) and projected scores"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Credits</th>
                    <th className="py-3 px-4">CIE Score</th>
                    <th className="py-3 px-4">Total Score</th>
                    <th className="py-3 px-4">Awarded Grade</th>
                    <th className="py-3 px-4 text-right">Academic Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marks.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block text-sm">{m.subjectName}</span>
                        <span className="font-mono text-xs text-teal-600 font-bold">{m.subjectCode}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{m.credits}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{m.totalCie} / 50</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">{m.totalMarks} / 100</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={m.grade === 'O' || m.grade === 'A+' ? 'success' : 'neutral'} size="sm">
                          Grade {m.grade}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="w-24 bg-slate-100 rounded-full h-2 ml-auto overflow-hidden">
                          <div
                            className="bg-teal-600 h-full rounded-full"
                            style={{ width: `${m.totalMarks}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
