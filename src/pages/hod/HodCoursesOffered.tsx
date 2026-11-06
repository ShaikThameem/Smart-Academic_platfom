import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import {
  BookOpen,
  Plus,
  Download,
  Filter,
  Search,
  Users,
  Clock,
  Layers,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { Subject, Faculty } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const HodCoursesOffered: React.FC = () => {
  const toast = useToast();
  const [courses, setCourses] = useState<Subject[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 4,
    type: 'core' as Subject['type'],
    weeklyHours: 4,
    facultyId: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [subList, facList] = await Promise.all([
          academicService.getSubjects(),
          academicService.getFaculty(),
        ]);
        setCourses(subList);
        setFacultyList(facList);
        if (facList.length > 0) {
          setFormData(prev => ({ ...prev, facultyId: facList[0].id }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const filtered = courses.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSem = selectedSemester === 'all' || c.semester.toString() === selectedSemester;
    return matchesSearch && matchesSem;
  });

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Please enter course code and title.');
      return;
    }

    try {
      const newSubject = await academicService.createSubject(formData);
      setCourses(prev => [...prev, newSubject]);
      toast.success(`Course ${formData.code} added to department curriculum!`);
      setIsAddModalOpen(false);
      setFormData({
        code: '',
        name: '',
        department: 'Computer Science & Engineering',
        semester: 5,
        credits: 4,
        type: 'core',
        weeklyHours: 4,
        facultyId: facultyList[0]?.id || '',
      });
    } catch (err) {
      toast.error('Failed to create course.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Courses Offered (Curriculum Scheme)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Degree curriculum catalog, credit structure, and faculty course coordinators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => toast.success('Curriculum Scheme exported (PDF).')}>
            <Download className="w-4 h-4 mr-1.5" />
            Export Scheme
          </Button>
          <Button variant="teal" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course code or name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
          >
            <option value="all">All Semesters (1 - 8)</option>
            <option value="1">Semester 1</option>
            <option value="3">Semester 3</option>
            <option value="5">Semester 5 (Current)</option>
            <option value="7">Semester 7</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(course => {
          const faculty = facultyList.find(f => f.id === course.facultyId);

          return (
            <Card key={course.id} className="hover:border-teal-200 transition-all">
              <CardHeader
                title={
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm line-clamp-1">{course.name}</span>
                    <Badge variant="teal">{course.code}</Badge>
                  </div>
                }
                subtitle={`B.Tech Semester ${course.semester} • ${course.type.toUpperCase()}`}
              />
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Credits</span>
                    <p className="text-sm font-bold text-slate-800">{course.credits}.0 Credits</p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Weekly Load</span>
                    <p className="text-sm font-bold text-teal-700">{course.weeklyHours} Hrs/Week</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Coordinator:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                    {faculty?.name || 'Assigned Faculty'}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Course Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Course to Department Catalog"
        maxWidth="md"
      >
        <form onSubmit={handleAddCourse} className="space-y-4 text-xs">
          <Input
            label="Course Code"
            placeholder="e.g. CS507"
            value={formData.code}
            onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
            required
          />

          <Input
            label="Course Title"
            placeholder="e.g. Distributed Cloud Computing"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester</label>
              <select
                className="w-full p-2 border rounded-lg bg-white"
                value={formData.semester}
                onChange={e => setFormData(prev => ({ ...prev, semester: Number(e.target.value) }))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course Type</label>
              <select
                className="w-full p-2 border rounded-lg bg-white capitalize"
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              >
                <option value="core">Core Theory</option>
                <option value="lab">Practical / Lab</option>
                <option value="elective">Professional Elective</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Credits"
              type="number"
              min="1"
              max="6"
              value={formData.credits}
              onChange={e => setFormData(prev => ({ ...prev, credits: Number(e.target.value) }))}
              required
            />
            <Input
              label="Weekly Lecture Hours"
              type="number"
              min="1"
              max="10"
              value={formData.weeklyHours}
              onChange={e => setFormData(prev => ({ ...prev, weeklyHours: Number(e.target.value) }))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Save Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
