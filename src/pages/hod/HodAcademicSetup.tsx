import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Layers,
  BookOpen,
  Users,
  Building,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  MapPin,
  Clock,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { Subject, Section, FacultyMember, Room, FacultyAllocation, SubjectType, RoomType } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const HodAcademicSetup: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'subjects' | 'faculty' | 'rooms' | 'allocations'>('subjects');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [allocations, setAllocations] = useState<FacultyAllocation[]>([]);

  // Modals state
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddAllocOpen, setIsAddAllocOpen] = useState(false);

  // Subject Form State
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subCredits, setSubCredits] = useState(4);
  const [subSessions, setSubSessions] = useState(4);
  const [subType, setSubType] = useState<SubjectType>('theory');

  // Faculty Form State
  const [facName, setFacName] = useState('');
  const [facEmail, setFacEmail] = useState('');
  const [facEmpId, setFacEmpId] = useState('');
  const [facDesig, setFacDesig] = useState('Assistant Professor');
  const [facSpecial, setFacSpecial] = useState('Machine Learning, Distributed Systems');
  const [facMaxHours, setFacMaxHours] = useState(18);

  // Room Form State
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('classroom');
  const [roomCapacity, setRoomCapacity] = useState(70);
  const [roomBuilding, setRoomBuilding] = useState('CS Block');
  const [roomFloor, setRoomFloor] = useState(2);
  const [roomProjector, setRoomProjector] = useState(true);

  // Allocation Form State
  const [allocFacultyId, setAllocFacultyId] = useState('');
  const [allocSubjectId, setAllocSubjectId] = useState('');
  const [allocSectionId, setAllocSectionId] = useState('');

  // Delete Confirm Dialog
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  const loadAll = async () => {
    try {
      const [subs, facs, rms, secs, allocs] = await Promise.all([
        academicService.getSubjects(),
        academicService.getFaculty(),
        academicService.getRooms(),
        academicService.getSections(),
        academicService.getAllocations(),
      ]);
      setSubjects(subs);
      setFaculty(facs);
      setRooms(rms);
      setSections(secs);
      setAllocations(allocs);

      if (facs.length > 0) setAllocFacultyId(facs[0].id);
      if (subs.length > 0) setAllocSubjectId(subs[0].id);
      if (secs.length > 0) setAllocSectionId(secs[0].id);
    } catch (err) {
      console.error('Failed to load academic setup', err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // --- Handlers ---
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCode.trim() || !subName.trim()) {
      toast.error('Subject code and title are required');
      return;
    }
    try {
      await academicService.addSubject({
        code: subCode.toUpperCase(),
        name: subName,
        department: 'CSE',
        semester: 5,
        credits: subCredits,
        weeklySessions: subSessions,
        type: subType,
        durationHours: subType === 'lab' ? 2.5 : 1.0,
        color: subType === 'lab' ? '#4F46E5' : '#2563EB',
      });
      toast.success(`Subject ${subCode.toUpperCase()} added successfully`);
      setIsAddSubjectOpen(false);
      setSubCode('');
      setSubName('');
      loadAll();
    } catch (err) {
      toast.error('Failed to add subject');
    }
  };

  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim() || !facEmpId.trim()) {
      toast.error('Name and Employee ID are required');
      return;
    }
    try {
      await academicService.addFaculty({
        name: facName,
        email: facEmail || `${facEmpId.toLowerCase()}@college.edu`,
        employeeId: facEmpId.toUpperCase(),
        department: 'Computer Science & Engineering',
        designation: facDesig,
        specialization: facSpecial,
        maxWeeklyHours: facMaxHours,
      });
      toast.success(`Faculty member ${facName} registered successfully`);
      setIsAddFacultyOpen(false);
      setFacName('');
      setFacEmpId('');
      loadAll();
    } catch (err) {
      toast.error('Failed to add faculty');
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      toast.error('Room code is required');
      return;
    }
    try {
      await academicService.addRoom({
        code: roomCode.toUpperCase(),
        name: roomName || `${roomCode} Hall`,
        type: roomType,
        capacity: roomCapacity,
        building: roomBuilding,
        floor: roomFloor,
        hasProjector: roomProjector,
        isAvailable: true,
      });
      toast.success(`Room ${roomCode} added successfully`);
      setIsAddRoomOpen(false);
      setRoomCode('');
      setRoomName('');
      loadAll();
    } catch (err) {
      toast.error('Failed to add room');
    }
  };

  const handleCreateAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await academicService.addAllocation({
        facultyId: allocFacultyId,
        subjectId: allocSubjectId,
        sectionId: allocSectionId,
        academicYear: '2026-2027',
        semester: 5,
      });
      toast.success('Teaching allocation assigned successfully');
      setIsAddAllocOpen(false);
      loadAll();
    } catch (err) {
      toast.error('Failed to assign allocation');
    }
  };

  const handleToggleRoom = async (id: string) => {
    try {
      const updated = await academicService.toggleRoomAvailability(id);
      setRooms(rooms.map(r => (r.id === id ? updated : r)));
      toast.info(`Room ${updated.code} is now ${updated.isAvailable ? 'Available' : 'Unavailable (Maintenance)'}`);
    } catch (err) {
      toast.error('Failed to toggle room status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'subject') {
        await academicService.deleteSubject(deleteTarget.id);
      } else if (deleteTarget.type === 'faculty') {
        await academicService.deleteFaculty(deleteTarget.id);
      } else if (deleteTarget.type === 'allocation') {
        await academicService.deleteAllocation(deleteTarget.id);
      }
      toast.success(`Deleted ${deleteTarget.name}`);
      setDeleteTarget(null);
      loadAll();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const tabs = [
    { id: 'subjects', label: 'Subjects & Credits', badge: subjects.length },
    { id: 'faculty', label: 'Faculty Roster', badge: faculty.length },
    { id: 'rooms', label: 'Rooms & Labs', badge: rooms.length },
    { id: 'allocations', label: 'Faculty Allotments', badge: allocations.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Setup & Resource Mapping
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure subjects, faculty qualifications, room capacities, and teaching assignments for Semester 5.
          </p>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(t) => setActiveTab(t as any)}
          className="border-none"
        />
      </div>

      {/* --- TAB 1: SUBJECTS --- */}
      {activeTab === 'subjects' && (
        <Card>
          <CardHeader
            title="Curriculum Subjects & Credit Allocation"
            subtitle="Configure credit weights, weekly contact hours, and practical laboratory flags"
            action={
              <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsAddSubjectOpen(true)}>
                Add Subject
              </Button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Subject Code</th>
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Weekly Sessions</th>
                  <th className="py-3 px-4">Session Duration</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{sub.code}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm">{sub.name}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={sub.type === 'lab' ? 'purple' : 'neutral'} size="sm">
                        {sub.type === 'lab' ? 'Laboratory' : 'Theory'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{sub.credits} Credits</td>
                    <td className="py-3.5 px-4 text-slate-600">{sub.weeklySessions} per week</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {sub.durationHours} hours ({sub.durationHours === 2.5 ? '150 min' : '60 min'})
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setDeleteTarget({ type: 'subject', id: sub.id, name: sub.code })}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Delete subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* --- TAB 2: FACULTY --- */}
      {activeTab === 'faculty' && (
        <Card>
          <CardHeader
            title="Department Faculty Roster"
            subtitle="Registered professors, specialization areas, and maximum weekly teaching limits"
            action={
              <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsAddFacultyOpen(true)}>
                Add Faculty
              </Button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Faculty Name</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Max Weekly Hours</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faculty.map(fac => (
                  <tr key={fac.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{fac.employeeId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm">{fac.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{fac.designation}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{fac.email}</td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">{fac.specialization}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{fac.maxWeeklyHours} hrs</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setDeleteTarget({ type: 'faculty', id: fac.id, name: fac.name })}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Delete faculty"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* --- TAB 3: ROOMS & LABS --- */}
      {activeTab === 'rooms' && (
        <Card>
          <CardHeader
            title="Classrooms, Lecture Halls & Computing Laboratories"
            subtitle="Manage seating capacities, AV projector facilities, and toggle maintenance downtime"
            action={
              <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsAddRoomOpen(true)}>
                Add Room / Lab
              </Button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Room Code</th>
                  <th className="py-3 px-4">Facility Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Seating Capacity</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Projector AV</th>
                  <th className="py-3 px-4 text-right">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map(room => (
                  <tr key={room.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{room.code}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{room.name}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={room.type === 'lab' ? 'purple' : 'neutral'} size="sm">
                        {room.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{room.capacity} seats</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {room.building}, Floor {room.floor}
                    </td>
                    <td className="py-3.5 px-4">
                      {room.hasProjector ? (
                        <span className="text-emerald-700 font-medium">Equipped</span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant={room.isAvailable ? 'outline' : 'danger'}
                        className="text-xs h-7"
                        onClick={() => handleToggleRoom(room.id)}
                      >
                        {room.isAvailable ? 'Available' : 'Maintenance'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* --- TAB 4: ALLOCATIONS --- */}
      {activeTab === 'allocations' && (
        <Card>
          <CardHeader
            title="Faculty Course Allotments"
            subtitle="Assign designated faculty members to specific subjects and student sections"
            action={
              <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsAddAllocOpen(true)}>
                New Allocation
              </Button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Assigned Faculty</th>
                  <th className="py-3 px-4">Subject Course</th>
                  <th className="py-3 px-4">Target Section</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Academic Year</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allocations.map(alloc => {
                  const fac = faculty.find(f => f.id === alloc.facultyId);
                  const sub = subjects.find(s => s.id === alloc.subjectId);
                  const sec = sections.find(s => s.id === alloc.sectionId);

                  return (
                    <tr key={alloc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {fac?.name || 'Faculty'}
                        <span className="block font-mono text-[10px] text-slate-400 font-normal">
                          {fac?.employeeId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-blue-600 font-bold mr-1">{sub?.code}</span>
                        <span className="text-slate-800">{sub?.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {sec?.name || 'CSE-5A'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">Semester {alloc.semester}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{alloc.academicYear}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setDeleteTarget({ type: 'allocation', id: alloc.id, name: `${sub?.code} Allotment` })}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Remove allocation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* --- MODAL: Add Subject --- */}
      <Modal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        title="Add New Academic Course"
        subtitle="Configure subject code, title, credits, and practical laboratory duration"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Code *</label>
              <input
                type="text"
                required
                value={subCode}
                onChange={e => setSubCode(e.target.value)}
                placeholder="e.g. CS308"
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Course Type</label>
              <select
                value={subType}
                onChange={e => setSubType(e.target.value as any)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="theory">Theory Lecture (1.0 hr)</option>
                <option value="lab">Practical Lab (2.5 hr)</option>
                <option value="elective">Department Elective</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Course Title *</label>
            <input
              type="text"
              required
              value={subName}
              onChange={e => setSubName(e.target.value)}
              placeholder="e.g. Artificial Intelligence & Expert Systems"
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Credit Weight</label>
              <input
                type="number"
                min="1"
                max="6"
                value={subCredits}
                onChange={e => setSubCredits(Number(e.target.value))}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Weekly Sessions</label>
              <input
                type="number"
                min="1"
                max="6"
                value={subSessions}
                onChange={e => setSubSessions(Number(e.target.value))}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddSubjectOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Subject
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL: Add Faculty --- */}
      <Modal
        isOpen={isAddFacultyOpen}
        onClose={() => setIsAddFacultyOpen(false)}
        title="Register Faculty Member"
        subtitle="Add teacher credentials and teaching capacity limits"
        maxWidth="md"
      >
        <form onSubmit={handleCreateFaculty} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={facName}
                onChange={e => setFacName(e.target.value)}
                placeholder="e.g. Dr. Ramesh Gupta"
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Employee ID *</label>
              <input
                type="text"
                required
                value={facEmpId}
                onChange={e => setFacEmpId(e.target.value)}
                placeholder="EMP-CSE-107"
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Designation</label>
              <select
                value={facDesig}
                onChange={e => setFacDesig(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Guest Lecturer">Guest Lecturer</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Max Weekly Hours</label>
              <input
                type="number"
                min="6"
                max="24"
                value={facMaxHours}
                onChange={e => setFacMaxHours(Number(e.target.value))}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Specialization Areas</label>
            <input
              type="text"
              value={facSpecial}
              onChange={e => setFacSpecial(e.target.value)}
              placeholder="e.g. Cloud Computing, Cryptography"
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddFacultyOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Register Faculty
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL: Add Room --- */}
      <Modal
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        title="Add Classroom or Laboratory"
        subtitle="Specify capacity, building, and AV infrastructure"
        maxWidth="md"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Room Code *</label>
              <input
                type="text"
                required
                value={roomCode}
                onChange={e => setRoomCode(e.target.value)}
                placeholder="e.g. LH-203 or LAB-303"
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Facility Type</label>
              <select
                value={roomType}
                onChange={e => setRoomType(e.target.value as any)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="classroom">Lecture Classroom</option>
                <option value="lab">Computing Laboratory</option>
                <option value="seminar">Seminar Auditorium</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Facility Name</label>
            <input
              type="text"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
              placeholder="e.g. Claude Shannon Lecture Hall"
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Capacity</label>
              <input
                type="number"
                min="20"
                max="250"
                value={roomCapacity}
                onChange={e => setRoomCapacity(Number(e.target.value))}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Building</label>
              <input
                type="text"
                value={roomBuilding}
                onChange={e => setRoomBuilding(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Floor</label>
              <input
                type="number"
                min="0"
                max="8"
                value={roomFloor}
                onChange={e => setRoomFloor(Number(e.target.value))}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="projectorCheck"
              checked={roomProjector}
              onChange={e => setRoomProjector(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="projectorCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
              Has Dedicated Ceiling Projector & AV Setup
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddRoomOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Facility
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL: Add Allocation --- */}
      <Modal
        isOpen={isAddAllocOpen}
        onClose={() => setIsAddAllocOpen(false)}
        title="Assign Faculty Teaching Allocation"
        subtitle="Connect professor, subject, and cohort section"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAllocation} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Select Faculty *</label>
            <select
              value={allocFacultyId}
              onChange={e => setAllocFacultyId(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {faculty.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.employeeId} - {f.designation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Select Subject *</label>
            <select
              value={allocSubjectId}
              onChange={e => setAllocSubjectId(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name} ({s.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Select Section *</label>
            <select
              value={allocSectionId}
              onChange={e => setAllocSectionId(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>
                  {sec.name} ({sec.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddAllocOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Confirm Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Removal"
        message={`Are you sure you want to remove "${deleteTarget?.name}"? Any dependent draft timetables may need regeneration.`}
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
};
