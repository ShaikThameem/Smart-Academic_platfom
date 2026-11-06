import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { BookOpen, User, Clock, Download, FileText, ExternalLink } from 'lucide-react';
import { academicService } from '../../services/academicService';
import { Subject, FacultyMember, FacultyAllocation } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const StudentSubjects: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [facultyMap, setFacultyMap] = useState<Record<string, FacultyMember>>({});
  const [allocations, setAllocations] = useState<FacultyAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      try {
        setIsLoading(true);
        const [subList, facList, allocList] = await Promise.all([
          academicService.getSubjects(),
          academicService.getFaculty(),
          academicService.getAllocations(),
        ]);
        setSubjects(subList);
        const fMap = facList.reduce((acc, f) => ({ ...acc, [f.id]: f }), {});
        setFacultyMap(fMap);
        setAllocations(allocList);
      } catch (err) {
        console.error('Failed to load student subjects', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSubjects();
  }, [user]);

  const handleDownloadSyllabus = (code: string) => {
    toast.success(`Curriculum syllabus handbook for ${code} downloaded.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
              Undergraduate Degree Curriculum
            </span>
            <Badge variant="info" size="sm">
              7 Registered Courses
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            My Enrolled Subjects · Semester 5
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            B.Tech Computer Science & Engineering · Regulation 2024-2028 · Total 22 Credits
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map(subject => {
          const alloc = allocations.find(a => a.subjectId === subject.id && a.sectionId === user.sectionId);
          const faculty = alloc ? facultyMap[alloc.facultyId] : null;

          return (
            <Card key={subject.id} className="flex flex-col justify-between hover:border-teal-300 transition-all">
              <div>
                <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-600 block">{subject.code}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{subject.name}</h3>
                  </div>
                  <Badge variant={subject.type === 'lab' ? 'purple' : 'neutral'} size="sm">
                    {subject.type === 'lab' ? 'Laboratory' : 'Theory'}
                  </Badge>
                </div>

                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Credits</span>
                      <span className="font-bold text-slate-800">{subject.credits} Credits</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Weekly Hours</span>
                      <span className="font-bold text-slate-800">{subject.weeklySessions} Hours/Week</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Course Faculty Instructor
                    </span>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {faculty?.name ? faculty.name.charAt(4) || 'P' : 'F'}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">{faculty?.name || 'Prof. Faculty In-Charge'}</span>
                        <span className="text-[10px] text-slate-500">{faculty?.designation || 'Department of CSE'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/60 rounded-b-xl flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {subject.durationHours === 2.5 ? '2.5h Practical Session' : '60m Lecture'}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  leftIcon={<Download className="w-3 h-3" />}
                  onClick={() => handleDownloadSyllabus(subject.code)}
                >
                  Syllabus PDF
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
