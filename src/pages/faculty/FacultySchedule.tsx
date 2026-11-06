import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  CalendarRange,
  Clock,
  MapPin,
  Users,
  Download,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { timetableService } from '../../services/timetableService';
import { academicService } from '../../services/academicService';
import { TimetableSlot, Subject, Section, Room } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15',
  '12:15 - 01:15',
  '02:00 - 03:00',
  '03:00 - 04:00',
  '04:00 - 05:00',
];

export const FacultySchedule: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [subjectsMap, setSubjectsMap] = useState<Record<string, Subject>>({});
  const [sectionsMap, setSectionsMap] = useState<Record<string, Section>>({});
  const [roomsMap, setRoomsMap] = useState<Record<string, Room>>({});
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [isLoading, setIsLoading] = useState(true);

  // Faculty ID (Dr. Robert Chen fac-101 or current user)
  const facultyId = user.role === 'faculty' ? user.id : 'fac-101';

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [timetableSlots, subList, secList, rmList] = await Promise.all([
          timetableService.getPublishedTimetable(undefined, facultyId),
          academicService.getSubjects(),
          academicService.getSections(),
          academicService.getRooms(),
        ]);

        const sMap = subList.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
        const secMap = secList.reduce((acc, sec) => ({ ...acc, [sec.id]: sec }), {});
        const rMap = rmList.reduce((acc, r) => ({ ...acc, [r.id]: r }), {});

        setSlots(timetableSlots);
        setSubjectsMap(sMap);
        setSectionsMap(secMap);
        setRoomsMap(rMap);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [facultyId]);

  const handleExportSchedule = () => {
    toast.success('Official Faculty Teaching Schedule (PDF) exported successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Faculty Teaching Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Published semester timetable, lecture hours, and lab assignments for {user.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                viewMode === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                viewMode === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily View
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={handleExportSchedule}>
            <Download className="w-4 h-4 mr-1.5" />
            Export Schedule
          </Button>
        </div>
      </div>

      {/* Daily Day Selector if in daily mode */}
      {viewMode === 'daily' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                selectedDay === day
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* Weekly Grid View */}
      {viewMode === 'weekly' ? (
        <Card className="overflow-x-auto">
          <CardContent className="p-0">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="p-3 w-28 border-r border-slate-200">Time / Period</th>
                  {DAYS.map(d => (
                    <th key={d} className="p-3 text-center border-r border-slate-200 last:border-r-0">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TIME_SLOTS.map(time => (
                  <tr key={time} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-medium text-slate-500 bg-slate-50/70 border-r border-slate-200">
                      {time}
                    </td>
                    {DAYS.map(day => {
                      const slot = slots.find(s => s.day === day && s.timeSlot === time);
                      if (!slot) {
                        return (
                          <td key={day} className="p-2 border-r border-slate-100 last:border-r-0 bg-slate-50/20">
                            <span className="text-[10px] text-slate-300 block text-center italic">—</span>
                          </td>
                        );
                      }

                      const sub = subjectsMap[slot.subjectId];
                      const sec = sectionsMap[slot.sectionId];
                      const room = roomsMap[slot.roomId];

                      return (
                        <td key={day} className="p-2 border-r border-slate-100 last:border-r-0">
                          <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200 text-slate-900 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-teal-900 text-xs">{sub?.code || 'CS501'}</span>
                              <Badge variant="teal" className="text-[9px] px-1.5 py-0">{sec?.name || 'Sec 5-A'}</Badge>
                            </div>
                            <p className="font-medium text-[11px] text-slate-800 line-clamp-1">{sub?.name || 'Course'}</p>
                            <div className="flex items-center gap-1 text-[10px] text-teal-700">
                              <MapPin className="w-3 h-3" />
                              <span>{room?.name || 'Room 402'}</span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        /* Daily View */
        <div className="space-y-3">
          {slots.filter(s => s.day === selectedDay).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-slate-500 text-xs">
                No classes scheduled for {selectedDay}. Research & office hours day.
              </CardContent>
            </Card>
          ) : (
            slots
              .filter(s => s.day === selectedDay)
              .map(slot => {
                const sub = subjectsMap[slot.subjectId];
                const sec = sectionsMap[slot.sectionId];
                const room = roomsMap[slot.roomId];

                return (
                  <Card key={slot.id} className="hover:border-teal-200 transition-all">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-teal-50 border border-teal-200 flex flex-col items-center justify-center text-teal-800 font-mono text-xs shrink-0">
                          <Clock className="w-4 h-4 mb-0.5 text-teal-600" />
                          <span className="text-[10px] font-bold">{(slot.timeSlot || `${slot.startTime} - ${slot.endTime}`).split(' - ')[0]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-teal-700">{sub?.code}</span>
                            <Badge variant="teal">{sec?.name || 'Section 5-A'}</Badge>
                            <Badge variant="info">{slot.day}</Badge>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mt-0.5">{sub?.name}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {room?.name || 'Room 402'} ({room?.type || 'Lecture Hall'})
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" /> Capacity: {room?.capacity || 60}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button variant="outline" size="sm" onClick={() => toast.success(`Viewing roster for ${sub?.name}`)}>
                          View Student Roster
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </div>
      )}
    </div>
  );
};
