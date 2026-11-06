import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Cpu,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Settings,
  Layers,
  MapPin,
  User,
  RotateCcw,
  Send,
  Edit2,
  Trash2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { timetableService, TimetableConflict } from '../../services/timetableService';
import { academicService } from '../../services/academicService';
import { TimetableSlot, Subject, FacultyMember, Room, Section, DayOfWeek, TimetableConfig } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const HodIntelligentGenerator: React.FC = () => {
  const toast = useToast();

  const [config, setConfig] = useState<TimetableConfig>(() => timetableService.getConfig());
  const [selectedSection, setSelectedSection] = useState('sec-cse-5a');
  const [sections, setSections] = useState<Section[]>([]);
  const [subjectsMap, setSubjectsMap] = useState<Record<string, Subject>>({});
  const [facultyMap, setFacultyMap] = useState<Record<string, FacultyMember>>({});
  const [roomsMap, setRoomsMap] = useState<Record<string, Room>>({});

  const [draftSlots, setDraftSlots] = useState<TimetableSlot[]>([]);
  const [conflicts, setConflicts] = useState<TimetableConflict[]>([]);
  const [qualityScore, setQualityScore] = useState<number>(98);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedVersion, setPublishedVersion] = useState<string>('v2.1 (Live)');

  // Direct publish confirmation
  const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState(false);

  // Edit slot modal state
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editRoomId, setEditRoomId] = useState('');
  const [editFacultyId, setEditFacultyId] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const [secList, subList, facList, roomList, currentDraft] = await Promise.all([
          academicService.getSections(),
          academicService.getSubjects(),
          academicService.getFaculty(),
          academicService.getRooms(),
          timetableService.getDraftTimetable('sec-cse-5a'),
        ]);

        const sMap = subList.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
        const fMap = facList.reduce((acc, f) => ({ ...acc, [f.id]: f }), {});
        const rMap = roomList.reduce((acc, r) => ({ ...acc, [r.id]: r }), {});

        setSections(secList);
        setSubjectsMap(sMap);
        setFacultyMap(fMap);
        setRoomsMap(rMap);
        setDraftSlots(currentDraft);
        setConflicts(timetableService.detectConflicts(currentDraft));
      } catch (err) {
        console.error('Failed to initialize generator', err);
      }
    }
    init();
  }, []);

  const handleRunGenerator = async () => {
    try {
      setIsGenerating(true);
      toast.info('Running intelligent constraint satisfaction algorithm...');

      // Small algorithm execution delay
      await new Promise(r => setTimeout(r, 600));

      const result = await timetableService.generateDraftTimetable(selectedSection, config);
      setDraftSlots(result.slots);
      setConflicts(result.conflicts);
      setQualityScore(result.qualityScore);

      if (result.conflicts.length === 0) {
        toast.success(`Generated optimized schedule! Quality Score: ${result.qualityScore}% (0 clashes).`);
      } else {
        toast.warning(`Generated schedule with ${result.conflicts.length} soft constraints.`);
      }
    } catch (err) {
      toast.error('Timetable generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDirectPublish = async () => {
    try {
      setIsPublishing(true);
      const newVersion = await timetableService.publishTimetable(
        'Semester 5 Autumn 2024 Final Regular Timetable',
        draftSlots
      );
      setPublishedVersion(newVersion.versionNumber + ' (Live)');
      setIsConfirmPublishOpen(false);
      toast.success(
        `Timetable ${newVersion.versionNumber} published directly to student & faculty portals!`
      );
    } catch (err) {
      toast.error('Publication failed.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleOpenEdit = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setEditStartTime(slot.startTime);
    setEditEndTime(slot.endTime);
    setEditRoomId(slot.roomId);
    setEditFacultyId(slot.facultyId);
  };

  const handleSaveEdit = async () => {
    if (!editingSlot) return;

    const updated: TimetableSlot = {
      ...editingSlot,
      startTime: editStartTime,
      endTime: editEndTime,
      timeSlot: `${editStartTime} - ${editEndTime}`,
      roomId: editRoomId,
      facultyId: editFacultyId,
    };

    const nextSlots = draftSlots.map(s => (s.id === editingSlot.id ? updated : s));
    setDraftSlots(nextSlots);
    setConflicts(timetableService.detectConflicts(nextSlots));
    setEditingSlot(null);
    toast.success('Slot updated and conflict matrix refreshed.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Intelligent Timetable Generator
            </h2>
            <Badge variant="teal">AI Constraint Engine</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-generate conflict-free schedules with workload balance, lab room constraints, and one-click direct publishing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {sections.map(sec => (
              <option key={sec.id} value={sec.id}>
                {sec.name} ({sec.department})
              </option>
            ))}
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRunGenerator}
            disabled={isGenerating}
          >
            <Sparkles className="w-4 h-4 mr-1.5 text-teal-600" />
            {isGenerating ? 'Generating...' : 'Re-Run Engine'}
          </Button>

          <Button
            size="sm"
            variant="teal"
            onClick={() => setIsConfirmPublishOpen(true)}
            disabled={isPublishing || draftSlots.length === 0}
          >
            <Send className="w-4 h-4 mr-1.5" />
            Direct Publish Live
          </Button>
        </div>
      </div>

      {/* Engine Metrics & Direct Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-medium text-slate-500 block">Current Live Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold text-teal-700">{publishedVersion}</span>
            <Badge variant="success">Active</Badge>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Live on Student & Faculty Portals</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-medium text-slate-500 block">Clash Matrix Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-base font-bold ${conflicts.length === 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {conflicts.length === 0 ? '0 Clashes Detected' : `${conflicts.length} Overlaps`}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Constraint satisfaction: {qualityScore}%</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-medium text-slate-500 block">Weekly Lecture Slots</span>
          <span className="text-base font-bold text-slate-900 mt-1 block">
            {draftSlots.filter(s => s.type === 'theory').length} Theory Sessions
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">1-Hour periods with 10m buffer</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-medium text-slate-500 block">Weekly Lab Sessions</span>
          <span className="text-base font-bold text-slate-900 mt-1 block">
            {draftSlots.filter(s => s.type === 'lab').length} Immersion Labs
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">2.5-Hour specialized lab blocks</span>
        </Card>
      </div>

      {/* Timetable Weekly Matrix */}
      <Card className="overflow-x-auto">
        <CardHeader
          title="Generated Timetable Draft"
          subtitle="Click on any cell to inspect or manually override slot allocation"
        />
        <CardContent className="p-0">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="p-3 w-28 border-r border-slate-200">Day</th>
                <th className="p-3 border-r border-slate-200">08:30 - 09:30</th>
                <th className="p-3 border-r border-slate-200">09:30 - 10:30</th>
                <th className="p-3 border-r border-slate-200">10:45 - 11:45</th>
                <th className="p-3 border-r border-slate-200">11:45 - 12:45</th>
                <th className="p-3 border-r border-slate-200 bg-amber-50/40 text-amber-900">Lunch</th>
                <th className="p-3 border-r border-slate-200">01:30 - 02:30</th>
                <th className="p-3">02:30 - 04:30 (Lab)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DAYS.map(day => {
                const daySlots = draftSlots.filter(s => s.day === day);

                return (
                  <tr key={day} className="hover:bg-slate-50/40">
                    <td className="p-3 font-semibold text-slate-900 bg-slate-50/80 border-r border-slate-200">
                      {day}
                    </td>

                    {/* Morning slot 1 */}
                    <td className="p-2 border-r border-slate-100">
                      {renderSlotCell(daySlots.find(s => s.startTime === '08:30'))}
                    </td>

                    {/* Morning slot 2 */}
                    <td className="p-2 border-r border-slate-100">
                      {renderSlotCell(daySlots.find(s => s.startTime === '09:30'))}
                    </td>

                    {/* Morning slot 3 */}
                    <td className="p-2 border-r border-slate-100">
                      {renderSlotCell(daySlots.find(s => s.startTime === '10:45'))}
                    </td>

                    {/* Morning slot 4 */}
                    <td className="p-2 border-r border-slate-100">
                      {renderSlotCell(daySlots.find(s => s.startTime === '11:45'))}
                    </td>

                    {/* Lunch Break */}
                    <td className="p-2 border-r border-slate-100 bg-amber-50/30 text-center text-[10px] text-amber-700 font-medium">
                      Recess
                    </td>

                    {/* Afternoon slot */}
                    <td className="p-2 border-r border-slate-100">
                      {renderSlotCell(daySlots.find(s => s.startTime === '13:30' || s.startTime === '01:30'))}
                    </td>

                    {/* Afternoon lab */}
                    <td className="p-2">
                      {renderSlotCell(daySlots.find(s => s.type === 'lab'))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit Slot Modal */}
      {editingSlot && (
        <Modal
          isOpen={true}
          onClose={() => setEditingSlot(null)}
          title={`Edit Slot: ${subjectsMap[editingSlot.subjectId]?.name || 'Course'}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                <input
                  type="text"
                  value={editStartTime}
                  onChange={e => setEditStartTime(e.target.value)}
                  className="w-full p-2 border rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                <input
                  type="text"
                  value={editEndTime}
                  onChange={e => setEditEndTime(e.target.value)}
                  className="w-full p-2 border rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Faculty</label>
              <select
                value={editFacultyId}
                onChange={e => setEditFacultyId(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white"
              >
                {Object.values(facultyMap).map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Room</label>
              <select
                value={editRoomId}
                onChange={e => setEditRoomId(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white"
              >
                {Object.values(roomsMap).map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} - {r.type} (Cap: {r.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setEditingSlot(null)}>
                Cancel
              </Button>
              <Button variant="teal" size="sm" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Direct Publish Confirmation Modal */}
      <ConfirmDialog
        isOpen={isConfirmPublishOpen}
        onClose={() => setIsConfirmPublishOpen(false)}
        onConfirm={handleDirectPublish}
        title="Direct Publish Timetable to Production?"
        message="This will instantly deploy this schedule version to all enrolled students and faculty members. Any active notifications will be sent automatically."
        confirmText="Publish Directly"
        variant="primary"
      />
    </div>
  );

  function renderSlotCell(slot?: TimetableSlot) {
    if (!slot) {
      return (
        <div className="h-14 rounded-lg border border-dashed border-slate-200 bg-slate-50/30 flex items-center justify-center text-[10px] text-slate-300">
          Empty
        </div>
      );
    }

    const sub = subjectsMap[slot.subjectId];
    const fac = facultyMap[slot.facultyId];
    const rm = roomsMap[slot.roomId];
    const isLabSlot = slot.type === 'lab' || slot.isLab;

    return (
      <div
        onClick={() => handleOpenEdit(slot)}
        className={`p-2 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
          isLabSlot
            ? 'bg-purple-50/70 border-purple-200 text-purple-950'
            : 'bg-teal-50/70 border-teal-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] font-mono text-teal-900">
            {sub?.code || 'CS501'}
          </span>
          <Badge variant={isLabSlot ? 'purple' : 'teal'} className="text-[9px] px-1 py-0">
            {isLabSlot ? 'LAB' : 'THEORY'}
          </Badge>
        </div>
        <p className="text-[11px] font-medium text-slate-800 line-clamp-1 mt-0.5">
          {sub?.name || 'Subject'}
        </p>
        <div className="text-[9px] text-slate-500 flex items-center justify-between mt-1 pt-1 border-t border-slate-200/50">
          <span>{rm?.name || 'Room 402'}</span>
          <span className="truncate max-w-[80px]">{fac?.name?.split(' ').slice(-1)[0] || 'Faculty'}</span>
        </div>
      </div>
    );
  }
};
