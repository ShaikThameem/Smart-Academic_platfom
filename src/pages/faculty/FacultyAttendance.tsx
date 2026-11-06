import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  ClipboardCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Users,
  Calendar,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { academicService } from '../../services/academicService';
import { AttendanceStatus, Subject, Section } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

interface StudentRosterItem {
  studentId: string;
  rollNo: string;
  name: string;
  email: string;
  status: AttendanceStatus;
  remarks?: string;
}

export const FacultyAttendance: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSection, setSelectedSection] = useState('sec-cse-5a');
  const [selectedSubject, setSelectedSubject] = useState('sub-cs301');
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [sessionTopic, setSessionTopic] = useState('Graph Traversal & Dijkstra Algorithm Implementation');

  const [roster, setRoster] = useState<StudentRosterItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const [secList, subList] = await Promise.all([
          academicService.getSections(),
          academicService.getSubjects(),
        ]);
        setSections(secList);
        setSubjects(subList);
      } catch (err) {
        console.error('Failed to load attendance dropdowns', err);
      }
    }
    loadConfig();
  }, []);

  const loadRoster = async () => {
    try {
      setIsLoading(true);
      setIsSavedSuccessfully(false);
      const data = await attendanceService.getSessionRoster(selectedSection, selectedSubject, sessionDate);
      setRoster(data);
    } catch (err) {
      console.error('Failed to load roster', err);
      toast.error('Failed to load enrolled student roster');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoster();
  }, [selectedSection, selectedSubject, sessionDate]);

  const handleToggleStatus = (studentId: string, newStatus: AttendanceStatus) => {
    setRoster(prev => prev.map(s => (s.studentId === studentId ? { ...s, status: newStatus } : s)));
    setIsSavedSuccessfully(false);
  };

  const handleBulkMark = (status: AttendanceStatus) => {
    setRoster(prev => prev.map(s => ({ ...s, status })));
    setIsSavedSuccessfully(false);
    toast.info(`Marked all students as ${status.toUpperCase()}`);
  };

  const handleSaveAttendance = async () => {
    if (!sessionTopic.trim()) {
      toast.error('Please enter a session curriculum topic before saving');
      return;
    }

    try {
      setIsSaving(true);
      const result = await attendanceService.saveSessionAttendance({
        sectionId: selectedSection,
        subjectId: selectedSubject,
        date: sessionDate,
        sessionTitle: sessionTopic,
        records: roster.map(r => ({
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks,
        })),
      });

      setIsSavedSuccessfully(true);
      setIsConfirmOpen(false);
      toast.success(result.message);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save attendance records');
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = roster.filter(r => r.status === 'present').length;
  const absentCount = roster.filter(r => r.status === 'absent').length;
  const lateCount = roster.filter(r => r.status === 'late').length;
  const attendanceRate = roster.length > 0 ? Math.round((presentCount / roster.length) * 1000) / 10 : 0;

  const filteredRoster = roster.filter(
    r =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Session Configuration Card */}
      <Card>
        <CardHeader
          title="Classroom Attendance Session Setup"
          subtitle="Select section, assigned subject, and session date to record or edit attendance"
        />
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Section</label>
              <select
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {sections.map(sec => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name} ({sec.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Course</label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Lecture Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={e => setSessionDate(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Curriculum Topic</label>
              <input
                type="text"
                value={sessionTopic}
                onChange={e => setSessionTopic(e.target.value)}
                placeholder="e.g. Graph Traversal Algorithms"
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Session Attendance Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrolled"
          value={roster.length}
          subtitle="Section CSE-5A roster"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Present"
          value={presentCount}
          subtitle="In classroom / laboratory"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          badge={<Badge variant="success" size="sm">{attendanceRate}%</Badge>}
        />

        <StatCard
          title="Absent"
          value={absentCount}
          subtitle="Unexcused absence"
          icon={<XCircle className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
        />

        <StatCard
          title="Late Entry"
          value={lateCount}
          subtitle="Entered after 10 min window"
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Roster & Marking Sheet */}
      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <span>Student Roster & Verification</span>
              {isSavedSuccessfully && (
                <Badge variant="success" size="sm">
                  Saved & Confirmed
                </Badge>
              )}
            </div>
          }
          subtitle="Toggle individual student status or use bulk actions"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkMark('present')}
              >
                Mark All Present
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkMark('absent')}
              >
                Mark All Absent
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                leftIcon={<Save className="w-3.5 h-3.5" />}
                onClick={() => setIsConfirmOpen(true)}
                isLoading={isSaving}
              >
                Save Attendance
              </Button>
            </div>
          }
        />

        {/* Search bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name or roll number (e.g. 'Aarav', '001')..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredRoster.length} of {roster.length} students
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">USN / Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">Status Selection</th>
                <th className="py-3 px-4">Session Remarks (Optional)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoster.map((student) => {
                return (
                  <tr key={student.studentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {student.rollNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 text-sm">{student.name}</div>
                      <div className="text-[11px] text-slate-400">{student.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(student.studentId, 'present')}
                          className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                            student.status === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(student.studentId, 'absent')}
                          className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                            student.status === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(student.studentId, 'late')}
                          className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                            student.status === 'late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Add reason if absent..."
                        value={student.remarks || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setRoster(prev =>
                            prev.map(s => (s.studentId === student.studentId ? { ...s, remarks: val } : s))
                          );
                        }}
                        className="w-full text-xs border border-slate-200 rounded px-2.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSaveAttendance}
        title="Confirm Attendance Submission"
        message={`Are you sure you want to log attendance for ${presentCount} present and ${absentCount} absent students on ${sessionDate} for "${sessionTopic}"? This will update student attendance percentages.`}
        confirmText="Confirm & Save Records"
        isLoading={isSaving}
      />
    </div>
  );
};
