import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  CheckCheck,
  AlertTriangle,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { academicService } from '../../services/academicService';
import { StudentAttendanceSummary, AttendanceRecord, Subject } from '../../types/academic';

export const StudentAttendance: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<{
    overallPercentage: number;
    totalAttended: number;
    totalClasses: number;
    subjects: StudentAttendanceSummary[];
  }>({ overallPercentage: 0, totalAttended: 0, totalClasses: 0, subjects: [] });

  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [subjectsMap, setSubjectsMap] = useState<Record<string, Subject>>({});
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      try {
        setIsLoading(true);
        const [sum, logList, subList] = await Promise.all([
          attendanceService.getStudentSummary(user.id),
          attendanceService.getStudentLogs(user.id),
          academicService.getSubjects(),
        ]);

        const sMap = subList.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
        setSummary(sum);
        setLogs(logList);
        setSubjectsMap(sMap);
      } catch (err) {
        console.error('Failed to load student attendance', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAttendance();
  }, [user]);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (selectedSubjectFilter !== 'all' && log.subjectId !== selectedSubjectFilter) return false;
    if (selectedStatusFilter !== 'all' && log.status !== selectedStatusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${summary.overallPercentage}%`}
          subtitle={`${summary.totalAttended} of ${summary.totalClasses} classes attended`}
          icon={<CheckCheck className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
          badge={
            <Badge variant={summary.overallPercentage >= 75 ? 'success' : 'danger'} size="sm">
              {summary.overallPercentage >= 75 ? 'Exam Eligible' : 'Debarment Risk'}
            </Badge>
          }
        />

        <StatCard
          title="Minimum Required"
          value="75.0%"
          subtitle="Mandatory university exam threshold"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Critical Subjects"
          value={summary.subjects.filter(s => s.status === 'critical').length}
          subtitle="Subjects currently under 75%"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
          badge={
            <Badge variant="danger" size="sm">
              Action Required
            </Badge>
          }
        />

        <StatCard
          title="Total Logged Sessions"
          value={summary.totalClasses}
          subtitle="Across 7 courses in Semester 5"
          icon={<Calendar className="w-5 h-5" />}
          iconBg="bg-slate-100 text-slate-700"
        />
      </div>

      {/* Subject-Wise Breakdown Table */}
      <Card>
        <CardHeader
          title="Subject-Wise Attendance Breakdown & 75% Recovery Calculator"
          subtitle="Dynamically computed from actual session logs. 75% required for examination hall ticket."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Classes Counted</th>
                <th className="py-3 px-4">Attended</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Eligibility Status</th>
                <th className="py-3 px-4 text-right">Recovery / Cushion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.subjects.map(item => {
                const isUnder = item.percentage < 75;
                const isBorderline = item.percentage >= 75 && item.percentage < 80;

                return (
                  <tr key={item.subjectId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-sm">{item.subjectName}</div>
                      <div className="font-mono text-xs text-blue-600">{item.subjectCode}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-sm">
                      {item.total}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-sm">
                      {item.attended}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isUnder ? 'text-rose-600' : isBorderline ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {item.percentage}%
                        </span>
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${isUnder ? 'bg-rose-500' : isBorderline ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, item.percentage)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={item.status === 'critical' ? 'danger' : item.status === 'warning' ? 'warning' : 'success'}
                        size="sm"
                      >
                        {item.status === 'critical' ? 'Critical Deficit (<75%)' : item.status === 'warning' ? 'Borderline (75-80%)' : 'Good Standing (≥80%)'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isUnder ? (
                        <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded text-[11px] inline-block">
                          Must attend next {item.neededFor75} classes
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">
                          Can safely miss {item.canMissNext} classes
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Attendance History Log */}
      <Card>
        <CardHeader
          title="Attendance History & Session Log"
          subtitle="Date-wise verification records submitted by respective faculty"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              {/* Subject filter */}
              <select
                value={selectedSubjectFilter}
                onChange={e => setSelectedSubjectFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">All Subjects</option>
                {summary.subjects.map(s => (
                  <option key={s.subjectId} value={s.subjectId}>
                    {s.subjectCode} - {s.subjectName}
                  </option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Curriculum Topic / Lab Exercise</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Remarks & Excuses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No matching attendance records found for this filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const sub = subjectsMap[log.subjectId];
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-blue-600 mr-1.5">{sub?.code}</span>
                        <span className="text-slate-800 font-medium">{sub?.name}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {log.sessionTitle || 'Regular Classroom Session'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {log.status === 'present' ? (
                          <Badge variant="success" size="sm">
                            Present
                          </Badge>
                        ) : log.status === 'absent' ? (
                          <Badge variant="danger" size="sm">
                            Absent
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            Late Entry
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {log.remarks || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
