import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  FileText,
  Filter,
  Layers,
  CalendarDays,
  List,
  Sparkles,
} from 'lucide-react';
import { timetableService } from '../../services/timetableService';
import { academicService } from '../../services/academicService';
import { TimetableSlot, Subject, FacultyMember, Room, DayOfWeek } from '../../types/academic';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const StudentTimetable: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [subjects, setSubjects] = useState<Record<string, Subject>>({});
  const [faculty, setFaculty] = useState<Record<string, FacultyMember>>({});
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [versionInfo, setVersionInfo] = useState({ version: 'v2.1', publishedDate: '2026-09-15' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTimetable() {
      try {
        setIsLoading(true);
        const [pubSlots, subList, facList, roomList] = await Promise.all([
          timetableService.getPublishedTimetable(user.sectionId),
          academicService.getSubjects(),
          academicService.getFaculty(),
          academicService.getRooms(),
        ]);

        const sMap = subList.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
        const fMap = facList.reduce((acc, f) => ({ ...acc, [f.id]: f }), {});
        const rMap = roomList.reduce((acc, r) => ({ ...acc, [r.id]: r }), {});

        setSlots(pubSlots);
        setSubjects(sMap);
        setFaculty(fMap);
        setRooms(rMap);
        setVersionInfo(timetableService.getPublishedVersionInfo());
      } catch (err) {
        console.error('Failed to load published timetable', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTimetable();
  }, [user]);

  // Distinct time slots across the week for the calendar view
  const timeHeaders = [
    '08:30 - 09:30',
    '09:30 - 10:30',
    '10:40 - 11:40',
    '11:40 - 12:40',
    '10:40 - 13:10 (Lab)',
    '13:00 - 15:30 (Lab)',
    '14:00 - 15:00',
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Official Academic Timetable
            </span>
            <Badge variant="success" size="sm">
              Published {versionInfo.version}
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Weekly Schedule · Section {user.sectionName || 'CSE-5A'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Published on {versionInfo.publishedDate}. Daily start at 08:30 AM with 10-minute inter-session breaks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Weekly Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daily List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid View */}
      {viewMode === 'calendar' ? (
        <Card className="overflow-hidden">
          <CardHeader
            title="Weekly Master Grid"
            subtitle="Displaying verified collision-free slots for Semester 5"
          />
          <div className="overflow-x-auto">
            <div className="min-w-[840px]">
              {/* Day rows */}
              {DAYS.map(day => {
                const daySlots = slots.filter(s => s.day === day);
                // Sort by start time
                daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

                return (
                  <div key={day} className="border-b border-slate-100 last:border-b-0 p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <h4 className="text-sm font-bold text-slate-900">{day}</h4>
                        <span className="text-xs text-slate-400">({daySlots.length} sessions)</span>
                      </div>
                      {day === 'Friday' && (
                        <span className="text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                          Practical Lab Day
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {daySlots.map(slot => {
                        const sub = subjects[slot.subjectId];
                        const fac = faculty[slot.facultyId];
                        const rm = rooms[slot.roomId];

                        return (
                          <div
                            key={slot.id}
                            className={`p-3 rounded-lg border text-left transition-all relative ${
                              slot.isLab
                                ? 'bg-purple-50/50 border-purple-200'
                                : 'bg-white border-slate-200/90 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                              <span className="flex items-center gap-1 font-mono text-slate-700">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <Badge variant={slot.isLab ? 'purple' : 'neutral'} size="sm" dot={false}>
                                {slot.isLab ? '2.5h Lab' : '1h Theory'}
                              </Badge>
                            </div>

                            <p className="font-semibold text-xs text-slate-900 leading-snug truncate">
                              <span className="text-blue-600 font-mono mr-1">{sub?.code}</span>
                              {sub?.name}
                            </p>

                            <div className="mt-2 text-[11px] text-slate-500 space-y-1">
                              <div className="flex items-center gap-1 truncate">
                                <User className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{fac?.name || 'Faculty Member'}</span>
                              </div>
                              <div className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="font-medium text-slate-700">{rm?.code || 'LH-201'}</span>
                                <span className="text-slate-400">({rm?.name})</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      ) : (
        /* Daily List View */
        <div className="space-y-4">
          {/* Day selection tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <Card>
            <CardHeader
              title={`Sessions for ${selectedDay}`}
              subtitle={`Detailed schedule for Section ${user.sectionName || 'CSE-5A'}`}
            />
            <CardContent>
              <div className="divide-y divide-slate-100">
                {slots
                  .filter(s => s.day === selectedDay)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((slot, index) => {
                    const sub = subjects[slot.subjectId];
                    const fac = faculty[slot.facultyId];
                    const rm = rooms[slot.roomId];

                    return (
                      <div key={slot.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-24 shrink-0 text-center py-2 px-3 bg-slate-100 rounded-lg border border-slate-200">
                            <span className="font-bold text-xs text-slate-900 block">{slot.startTime}</span>
                            <span className="text-[10px] text-slate-500 block">to {slot.endTime}</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-bold text-blue-600">{sub?.code}</span>
                              <Badge variant={slot.isLab ? 'purple' : 'neutral'} size="sm">
                                {slot.isLab ? 'Practical Laboratory' : 'Classroom Lecture'}
                              </Badge>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-900">{sub?.name}</h4>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {fac?.name} · {fac?.designation}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {rm?.code} ({rm?.building}, Floor {rm?.floor})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right sm:self-center">
                          <span className="text-xs text-slate-500 block">Credits: {sub?.credits || 4}</span>
                          <span className="text-[11px] text-emerald-600 font-medium">Room Assigned & Confirmed</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
