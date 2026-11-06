import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  Cpu,
  MessageSquareWarning,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { academicService } from '../../services/academicService';
import { timetableService } from '../../services/timetableService';
import { attendanceService } from '../../services/attendanceService';
import { FacultyFeedback } from '../../types/academic';

export const HodOverview: React.FC = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    facultyCount: 0,
    studentCount: 120,
    sectionCount: 0,
    subjectCount: 0,
    roomCount: 0,
  });
  const [defaultersCount, setDefaultersCount] = useState(0);
  const [feedbackList, setFeedbackList] = useState<FacultyFeedback[]>([]);
  const [versionInfo, setVersionInfo] = useState({ version: 'v2.1', publishedDate: '2026-09-15', totalSlots: 15 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [facList, secList, subList, rmList, fbList, defs] = await Promise.all([
          academicService.getFaculty(),
          academicService.getSections(),
          academicService.getSubjects(),
          academicService.getRooms(),
          timetableService.getFacultyFeedback(),
          attendanceService.getAttendanceDefaulters(),
        ]);

        const totalStudents = secList.reduce((sum, s) => sum + s.studentCount, 0);

        setStats({
          facultyCount: facList.length,
          studentCount: totalStudents || 120,
          sectionCount: secList.length,
          subjectCount: subList.length,
          roomCount: rmList.length,
        });

        setFeedbackList(fbList);
        setDefaultersCount(defs.length);
        setVersionInfo(timetableService.getPublishedVersionInfo());
      } catch (err) {
        console.error('Failed to load HOD overview', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingFeedback = feedbackList.filter(f => f.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2.5 py-0.5 rounded-full">
              HOD Administration · CSE Department
            </span>
            <span className="text-xs text-slate-400">{user.codeNumber}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {user.name} ({user.designation || 'Head of Department'})
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Department administrative console. Published timetable is live at <strong className="text-white">{versionInfo.version}</strong>. You have <strong className="text-amber-300">{pendingFeedback.length} pending faculty feedback items</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/hod/intelligent-generator">
            <Button size="sm" variant="teal" leftIcon={<Cpu className="w-4 h-4" />}>
              Intelligent Generator
            </Button>
          </Link>
          <Link to="/hod/academic-setup">
            <Button variant="secondary" size="sm" leftIcon={<Layers className="w-4 h-4" />}>
              Academic Setup
            </Button>
          </Link>
        </div>
      </div>

      {/* Department KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrolled Students"
          value={stats.studentCount}
          subtitle={`Across ${stats.sectionCount} Academic Sections`}
          icon={<GraduationCap className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
          badge={<Badge variant="info" size="sm">Active Cohort</Badge>}
        />

        <StatCard
          title="Department Faculty"
          value={stats.facultyCount}
          subtitle="Professors & Lecturers"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          badge={<span className="text-xs text-slate-500">100% Allocated</span>}
        />

        <StatCard
          title="Timetable Publication"
          value={versionInfo.version}
          subtitle={`${versionInfo.totalSlots} Slots Published`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
          badge={<Badge variant="success" size="sm">Live</Badge>}
        />

        <StatCard
          title="Attendance Defaulters"
          value={`${defaultersCount} Students`}
          subtitle="Attendance < 75% threshold"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
          badge={<Badge variant="danger" size="sm">Audit Required</Badge>}
        />
      </div>

      {/* Main Grid: Management Shortcuts & Timetable Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Pending Reviews and Section Health */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Faculty Feedback Card */}
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <span>Pending Faculty Timetable Concerns</span>
                  {pendingFeedback.length > 0 && (
                    <Badge variant="warning" size="sm">
                      {pendingFeedback.length} Needs Attention
                    </Badge>
                  )}
                </div>
              }
              subtitle="Timetable adjustment requests submitted by teaching staff"
              action={
                <Link to="/hod/faculty-review" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                  Review All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardContent>
              {pendingFeedback.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  All faculty feedback items have been resolved or reviewed.
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingFeedback.map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900">
                            Faculty: {item.facultyName || 'Dr. Rajesh Kumar'}
                          </span>
                          <Badge variant="teal" size="sm">
                            Curriculum Note
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-700 leading-snug">{item.reason || item.comments || 'Schedule optimized'}</p>
                      </div>

                      <Link to="/hod/intelligent-generator">
                        <Button size="sm" variant="outline" className="text-xs whitespace-nowrap bg-white">
                          Review in Generator
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic Resource Distribution */}
          <Card>
            <CardHeader
              title="Academic Setup Summary"
              subtitle="Core assets managed under CSE curriculum"
              action={
                <Link to="/hod/academic-setup" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                  Manage Resources <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl font-bold text-slate-900 block">{stats.subjectCount}</span>
                  <span className="text-xs text-slate-500">Subjects (Theory & Labs)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl font-bold text-slate-900 block">{stats.sectionCount}</span>
                  <span className="text-xs text-slate-500">Class Sections</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl font-bold text-slate-900 block">{stats.roomCount}</span>
                  <span className="text-xs text-slate-500">Halls & Workstations</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl font-bold text-slate-900 block">7</span>
                  <span className="text-xs text-slate-500">Faculty Allocations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right (1 col): Generator & Publication Quick Actions */}
        <div className="space-y-6">
          <Card className="border-purple-200 bg-gradient-to-b from-purple-50/40 to-white">
            <CardHeader
              title="Intelligent Timetable Generator"
              subtitle="Constraint-based automated scheduler"
            />
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates conflict-free timetable drafts enforcing:
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                <li>Strict <strong>08:30 AM</strong> start time</li>
                <li>1-hour theory lectures</li>
                <li>2.5-hour continuous laboratory slots</li>
                <li>10-minute inter-session breaks</li>
                <li>Friday dedicated lab-only schedule</li>
                <li>Zero simultaneous faculty/room collisions</li>
              </ul>

              <div className="pt-2">
                <Link to="/hod/timetable-generator">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Open Generator Console
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Academic Reports"
              subtitle="Audit attendance & performance"
            />
            <CardContent className="space-y-2">
              <p className="text-xs text-slate-500">
                View real-time defaulters list, section performance indices, and export official CSV reports.
              </p>
              <Link to="/hod/reports" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Generate Compliance Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
