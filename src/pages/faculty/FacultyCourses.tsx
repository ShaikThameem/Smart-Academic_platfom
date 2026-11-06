import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  BookOpen,
  Users,
  Clock,
  Download,
  UploadCloud,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { Subject } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const FacultyCourses: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [courses, setCourses] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default facultyId Dr. Robert Chen
  const facultyId = user.role === 'faculty' ? user.id : 'fac-101';

  useEffect(() => {
    async function loadCourses() {
      try {
        setIsLoading(true);
        const allSubjects = await academicService.getSubjects();
        // Show subjects where faculty is assigned or primary courses
        setCourses(allSubjects.filter(s => s.facultyId === facultyId || s.code.startsWith('CS50')));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, [facultyId]);

  const handleUploadNotes = (courseName: string) => {
    toast.success(`Lecture notes & slides upload dialog opened for ${courseName}.`);
  };

  const handleDownloadSyllabus = (code: string) => {
    toast.success(`Downloading official University Syllabus outline for ${code}.`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Assigned Teaching Courses</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Curriculum syllabi, course outcomes (COs), credit distribution, and class materials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="teal" className="py-1 px-3">
            Autumn 2024 Semester
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => (
          <Card key={course.id} className="hover:border-teal-200 transition-all">
            <CardHeader
              title={
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{course.name}</span>
                  <Badge variant="teal">{course.code}</Badge>
                </div>
              }
              subtitle={`B.Tech Semester ${course.semester} • ${course.type.toUpperCase()}`}
            />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Credits</div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">{course.credits}.0</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Weekly Hours</div>
                  <div className="text-sm font-bold text-teal-700 mt-0.5">
                    {course.weeklyHours} Hrs
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Students</div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">64</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                <p className="font-semibold text-slate-800">Key Course Modules:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Module 1: Fundamental Concepts & Architecture</li>
                  <li>Module 2: Core Protocols & Query Execution</li>
                  <li>Module 3: Optimization, Indexing & Distributed Systems</li>
                  <li>Module 4: Laboratory Practicals & Term Projects</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs flex-1"
                  onClick={() => handleDownloadSyllabus(course.code)}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Syllabus PDF
                </Button>
                <Button
                  variant="teal"
                  size="sm"
                  className="text-xs flex-1"
                  onClick={() => handleUploadNotes(course.name)}
                >
                  <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                  Upload Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
