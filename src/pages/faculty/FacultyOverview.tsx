import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Calendar,
  ClipboardCheck,
  FileSpreadsheet,
  CalendarRange,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { timetableService } from '../../services/timetableService';
import { academicService } from '../../services/academicService';
import { assessmentService } from '../../services/assessmentService';
import { TimetableSlot, Subject, Section, Assessment } from '../../types/academic';

export const FacultyOverview: React.FC = () => {
  const { user } = useAuth();

  const [todaySlots, setTodaySlots] = useState<TimetableSlot[]>([]);
  const [subjectsMap, setSubjectsMap] = useState<Record<string, Subject>>({});
  const [sectionsMap, setSectionsMap] = useState<Record<string, Section>>({});
  const [roomsMap, setRoomsMap] = useState<Record<string, any>>({});
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFacultyData() {
      try {
        setIsLoading(true);
        // Dr. Rajesh Kumar is fac-104
        const facultyId = 'fac-104';

        const [slots, subList, secList, rmList, asmtList, fbList] = await Promise.all([
          timetableService.getPublishedTimetable(undefined, facultyId),
          academicService.getSubjects(),
          academicService.getSections(),
          academicService.getRooms(),
          assessmentService.getAssessments(),
          timetableService.getFacultyFeedback(facultyId),
        ]);

        const sMap = subList.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
        const secMap = secList.reduce((acc, sec) => ({ ...acc, [sec.id]: sec }), {});
        const rMap = rmList.reduce((acc, r) => ({ ...acc, [r.id]: r }), {});

        setSubjectsMap(sMap);
        setSectionsMap(secMap);
        setRoomsMap(rMap);
        setAssessments(asmtList);
        setFeedbackList(fbList);

        // Filter for today (Monday simulation)
        setTodaySlots(slots.filter(s => s.day === 'Monday' || s.day === 'Tuesday'));
      } catch (err) {
        console.error('Failed to load faculty overview data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFacultyData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
              Faculty Portal · CSE Department
            </span>
            <span className="text-xs text-slate-400">{user.codeNumber}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {user.name} ({user.designation || 'Associate Professor'})
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            You are currently assigned to <strong className="text-white">CS301 (Data Structures)</strong> and <strong className="text-white">CS304 (Operating Systems)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/faculty/attendance">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" leftIcon={<ClipboardCheck className="w-4 h-4" />}>
              Mark Today's Attendance
            </Button>
          </Link>
          <Link to="/faculty/schedule">
            <Button variant="secondary" size="sm" leftIcon={<CalendarRange className="w-4 h-4" />}>
              Teaching Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Pending Attendance Notification banner */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-semibold text-slate-900 block">Pending Classroom Attendance Submission</span>
            <p className="text-slate-600 mt-0.5">
              Attendance log for <strong>CS301 (CSE-5A) - Session: B-Trees & Indexing</strong> is pending final sign-off.
            </p>
          </div>
        </div>
        <Link to="/faculty/attendance">
          <Button size="sm" variant="outline" className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100/60">
            Submit Attendance
          </Button>
        </Link>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Scheduled Classes"
          value="4 Sessions/Wk"
          subtitle="4 hours teaching load"
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
          badge={<Badge variant="info" size="sm">Max 18 hrs</Badge>}
        />

        <StatCard
          title="Assigned Students"
          value="60 Students"
          subtitle="Section CSE-5A"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Active Assessments"
          value={assessments.length}
          subtitle="Quiz 2 in progress"
          icon={<FileSpreadsheet className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
          badge={<Badge variant="warning" size="sm">1 Active</Badge>}
        />

        <StatCard
          title="Timetable Concerns"
          value={feedbackList.length}
          subtitle="Slot adjustment requests"
          icon={<CalendarRange className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
          badge={<Badge variant="neutral" size="sm">{feedbackList[0]?.status || 'Reviewed'}</Badge>}
        />
      </div>

      {/* Grid: Teaching Schedule & Assigned Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teaching Schedule (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              title="Assigned Teaching Schedule (Published v2.1)"
              subtitle="Your scheduled lecture halls and laboratory slots"
              action={
                <Link to="/faculty/timetable" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                  Manage Timetable <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardContent>
              <div className="space-y-3">
                {todaySlots.map((slot) => {
                  const sub = subjectsMap[slot.subjectId];
                  const sec = sectionsMap[slot.sectionId];
                  const room = roomsMap[slot.roomId];

                  return (
                    <div
                      key={slot.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-center min-w-[76px] py-1.5 px-2 rounded-lg bg-slate-100 border border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">{slot.day}</span>
                          <span className="text-xs font-bold text-slate-900 block">{slot.startTime}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-blue-600">{sub?.code}</span>
                            <Badge variant={slot.isLab ? 'purple' : 'neutral'} size="sm">
                              {slot.isLab ? 'Practical Lab' : 'Theory Lecture'}
                            </Badge>
                            <span className="text-xs font-semibold text-slate-700">
                              Section: {sec?.name || 'CSE-5A'}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-slate-900">{sub?.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>Room {room?.code} ({room?.name})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center">
                        <Link to="/faculty/attendance">
                          <Button size="sm" variant="outline" className="text-xs">
                            Mark Attendance
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Course Load & Assessments */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Assigned Courses"
              subtitle="Semester 5 Teaching Allotment"
            />
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600">CS301</span>
                  <Badge variant="info" size="sm">4 Credits</Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Advanced Data Structures & Algorithms</h4>
                <p className="text-[11px] text-slate-500">4 Weekly Hours · Section CSE-5A</p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600">CS304</span>
                  <Badge variant="purple" size="sm">4 Credits</Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Operating Systems & System Programming</h4>
                <p className="text-[11px] text-slate-500">4 Weekly Hours · Section CSE-5A</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Assessments Conducted"
              action={
                <Link to="/faculty/assessments">
                  <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    New Test
                  </Button>
                </Link>
              }
            />
            <CardContent className="space-y-2.5">
              {assessments.slice(0, 2).map(a => (
                <div key={a.id} className="p-3 rounded-lg border border-slate-100 bg-white">
                  <span className="text-xs font-semibold text-slate-900 block line-clamp-1">{a.title}</span>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{a.totalMarks} Marks · {a.durationMinutes}m</span>
                    <Badge variant="neutral" size="sm">{a.type}</Badge>
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
