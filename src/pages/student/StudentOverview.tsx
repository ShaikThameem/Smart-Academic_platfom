import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Calendar,
  CheckCheck,
  Award,
  BookOpen,
  Clock,
  MapPin,
  User,
  ArrowRight,
  AlertTriangle,
  GraduationCap,
  Bell,
  Users2,
  FileCheck2,
  Bot,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { timetableService } from '../../services/timetableService';
import { attendanceService } from '../../services/attendanceService';
import { assessmentService } from '../../services/assessmentService';
import { academicService } from '../../services/academicService';
import { TimetableSlot, Subject, Assessment, Announcement, SubjectMarks } from '../../types/academic';

export const StudentOverview: React.FC = () => {
  const { user } = useAuth();

  const [todaySlots, setTodaySlots] = useState<TimetableSlot[]>([]);
  const [subjectsMap, setSubjectsMap] = useState<Record<string, Subject>>({});
  const [facultyMap, setFacultyMap] = useState<Record<string, any>>({});
  const [roomsMap, setRoomsMap] = useState<Record<string, any>>({});
  const [attendanceData, setAttendanceData] = useState<{
    overallPercentage: number;
    totalAttended: number;
    totalClasses: number;
  }>({ overallPercentage: 0, totalAttended: 0, totalClasses: 0 });
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [marks, setMarks] = useState<SubjectMarks[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [slots, subs, fac, rms, att, asmts, mrkList, ancList] = await Promise.all([
          timetableService.getPublishedTimetable(user.sectionId),
          academicService.getSubjects(),
          academicService.getFaculty(),
          academicService.getRooms(),
          attendanceService.getStudentSummary(user.id),
          assessmentService.getAssessments(user.sectionId),
          academicService.getStudentMarks(user.id),
          academicService.getAnnouncements(),
        ]);

        const sMap = subs.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
        const fMap = fac.reduce((acc, f) => ({ ...acc, [f.id]: f }), {});
        const rMap = rms.reduce((acc, r) => ({ ...acc, [r.id]: r }), {});

        setSubjectsMap(sMap);
        setFacultyMap(fMap);
        setRoomsMap(rMap);
        setAttendanceData(att);
        setAssessments(asmts);
        setMarks(mrkList);
        setAnnouncements(ancList);

        // Simulation day (Monday)
        const todayName = 'Monday';
        const filtered = slots.filter(s => s.day === todayName);
        setTodaySlots(filtered);
      } catch (err) {
        console.error('Failed loading student overview data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2.5 py-0.5 rounded-full">
              B.Tech Undergraduate · Semester {user.semester || 5}
            </span>
            <span className="text-xs text-slate-300 font-mono">Academic Year 2026-2027</span>
            <span className="text-xs text-slate-400">· Section {user.sectionName || 'CSE-5A'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            USN: <strong className="text-teal-300 font-mono">{user.codeNumber}</strong> · You have <strong className="text-white">{todaySlots.length} sessions</strong> scheduled today and continuous assessments active.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/student/marks">
            <Button variant="secondary" size="sm" leftIcon={<Award className="w-4 h-4 text-teal-600" />}>
              View Marks
            </Button>
          </Link>
          <Link to="/student/ai-assistant">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700" leftIcon={<Bot className="w-4 h-4" />}>
              Ask Academic AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Attendance Deficit Alert */}
      {attendanceData.overallPercentage < 75 && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/80 text-amber-900 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-slate-900 block">Attendance Shortage Alert: CS303 (69.2%)</span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Your cumulative attendance in Computer Networks is below the 75% university requirement. Attend the next consecutive classes to avoid exam hall ticket withholding.
              </p>
            </div>
          </div>
          <Link to="/student/attendance">
            <Button variant="outline" size="sm" className="bg-white border-amber-300 text-amber-900 shrink-0">
              Check Deficit
            </Button>
          </Link>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${attendanceData.overallPercentage}%`}
          subtitle={`${attendanceData.totalAttended} of ${attendanceData.totalClasses} classes attended`}
          icon={<CheckCheck className="w-5 h-5" />}
          iconBg="bg-teal-50 text-teal-600"
          badge={
            <Badge variant={attendanceData.overallPercentage >= 75 ? 'success' : 'danger'} size="sm">
              {attendanceData.overallPercentage >= 75 ? 'Eligible' : 'Debarment Risk'}
            </Badge>
          }
        />

        <StatCard
          title="Cumulative CGPA"
          value="8.84"
          subtitle="88 Credits Completed"
          icon={<Award className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
          badge={<Badge variant="success" size="sm">First Class with Distinction</Badge>}
        />

        <StatCard
          title="Enrolled Subjects"
          value="7 Courses"
          subtitle="5 Theory, 2 Practical Labs"
          icon={<BookOpen className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Upcoming Assessments"
          value={assessments.length}
          subtitle="Quiz 2 deadline approaching"
          icon={<FileCheck2 className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
          badge={<Badge variant="warning" size="sm">Active</Badge>}
        />
      </div>

      {/* Main Grid: Today's Schedule & Academic Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Timeline (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Today's Academic Schedule (Monday)"
              subtitle="Collegiate 08:30 AM start with 10-minute transition intervals"
              action={
                <Link to="/student/timetable" className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1">
                  Full Timetable <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardContent>
              <div className="space-y-3">
                {todaySlots.map((slot, index) => {
                  const subject = subjectsMap[slot.subjectId];
                  const faculty = facultyMap[slot.facultyId];
                  const room = roomsMap[slot.roomId];
                  const isCurrent = index === 1;

                  return (
                    <div
                      key={slot.id}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/10'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="text-center min-w-[72px] py-1 px-2 rounded-lg bg-slate-100 border border-slate-200/80">
                          <span className="text-xs font-bold text-slate-800 block font-mono">{slot.startTime}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">{slot.endTime}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-teal-600">{subject?.code}</span>
                            <Badge variant={slot.isLab ? 'purple' : 'neutral'} size="sm">
                              {slot.isLab ? 'Laboratory (2.5h)' : 'Theory Lecture (1h)'}
                            </Badge>
                            {isCurrent && <Badge variant="info" size="sm">Happening Now</Badge>}
                          </div>
                          <h4 className="text-sm font-semibold text-slate-900 leading-snug">{subject?.name}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {faculty?.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {room?.code} ({room?.name})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <span className="text-[11px] text-slate-400">
                          Credits: {subject?.credits || 4}
                        </span>
                        <Link to="/student/attendance">
                          <span className="text-xs font-medium text-teal-600 hover:underline">
                            Attendance Log →
                          </span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Academic Navigation Hub */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link to="/student/marks" className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-xs transition-all text-center group">
              <Award className="w-5 h-5 text-teal-600 mx-auto mb-1.5 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-semibold text-slate-800 block">Semester Marks</span>
              <span className="text-[10px] text-slate-500">CIE & SEE Grades</span>
            </Link>

            <Link to="/student/subjects" className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-xs transition-all text-center group">
              <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1.5 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-semibold text-slate-800 block">My Subjects</span>
              <span className="text-[10px] text-slate-500">Curriculum & Credits</span>
            </Link>

            <Link to="/student/clubs" className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-xs transition-all text-center group">
              <Users2 className="w-5 h-5 text-indigo-600 mx-auto mb-1.5 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-semibold text-slate-800 block">College Clubs</span>
              <span className="text-[10px] text-slate-500">Technical & Cultural</span>
            </Link>

            <Link to="/student/complaints" className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-xs transition-all text-center group">
              <HelpCircle className="w-5 h-5 text-amber-600 mx-auto mb-1.5 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-semibold text-slate-800 block">Complaint Box</span>
              <span className="text-[10px] text-slate-500">Grievance Redressal</span>
            </Link>
          </div>
        </div>

        {/* Right Col: Announcements & Recent Marks */}
        <div className="space-y-6">
          {/* Department Announcements */}
          <Card>
            <CardHeader
              title="Department Notices"
              subtitle="Announcements & exam schedules"
              action={
                <Link to="/student/announcements" className="text-xs text-teal-600 font-semibold hover:underline">
                  All Notices
                </Link>
              }
            />
            <CardContent className="space-y-3">
              {announcements.slice(0, 3).map(anc => (
                <div key={anc.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant={anc.category === 'Examination' ? 'danger' : 'info'} size="sm">
                      {anc.category}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono">{anc.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 leading-snug">{anc.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{anc.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Internal Examination Marks */}
          <Card>
            <CardHeader
              title="Recent Examination Marks"
              subtitle="Continuous Internal Evaluation (CIE)"
              action={
                <Link to="/student/marks" className="text-xs text-teal-600 font-semibold hover:underline">
                  Scorebook
                </Link>
              }
            />
            <CardContent className="space-y-2.5">
              {marks.slice(0, 4).map(m => (
                <div key={m.id} className="p-3 rounded-lg border border-slate-100 bg-white flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">{m.subjectName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{m.subjectCode} · {m.credits} Credits</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">{m.totalMarks} / 100</span>
                    <Badge variant={m.grade === 'O' || m.grade === 'A+' ? 'success' : 'neutral'} size="sm" className="block text-center mt-0.5">
                      Grade {m.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
