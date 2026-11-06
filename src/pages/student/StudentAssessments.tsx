import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import {
  FileCheck2,
  Clock,
  Calendar,
  Download,
  CheckCircle2,
  ArrowRight,
  FileText,
  AlertCircle,
  HelpCircle,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { assessmentService } from '../../services/assessmentService';
import { academicService } from '../../services/academicService';
import { Assessment, StudentSubmission, PreviousYearPaper, Subject } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const StudentAssessments: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'available' | 'submissions' | 'pyqs'>('available');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [pyqs, setPyqs] = useState<PreviousYearPaper[]>([]);
  const [subjectsMap, setSubjectsMap] = useState<Record<string, Subject>>({});
  const [selectedPyqSubject, setSelectedPyqSubject] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [asmts, subms, pyqList, subList] = await Promise.all([
          assessmentService.getAssessments(user.sectionId),
          assessmentService.getSubmissions(undefined, user.id),
          assessmentService.getPYQs(),
          academicService.getSubjects(),
        ]);

        const sMap = subList.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
        setAssessments(asmts);
        setSubmissions(subms);
        setPyqs(pyqList);
        setSubjectsMap(sMap);
      } catch (err) {
        console.error('Failed to load assessment data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleDownloadPyq = (paper: PreviousYearPaper) => {
    toast.success(`Downloading question paper: ${paper.subjectCode} (${paper.year} ${paper.examType}). File size: ${paper.fileSize}`);
  };

  const tabs = [
    { id: 'available', label: 'Continuous Evaluations & Tests', badge: assessments.length },
    { id: 'submissions', label: 'My Submissions & Scores', badge: submissions.length },
    { id: 'pyqs', label: 'Previous Year Question Papers (PYQs)', badge: pyqs.length },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Assessments & Question Bank
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal assessments, timed quizzes, and University question archive for Semester 5.
          </p>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
          className="border-none"
        />
      </div>

      {/* Tab 1: Available Tests */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map(asmt => {
            const sub = subjectsMap[asmt.subjectId];
            const submission = submissions.find(s => s.assessmentId === asmt.id);
            const isCompleted = Boolean(submission);

            return (
              <Card key={asmt.id} className="flex flex-col justify-between">
                <div>
                  <CardHeader
                    title={
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {sub?.code || 'CS301'}
                        </span>
                        <span className="text-slate-900 font-semibold text-sm line-clamp-1">
                          {asmt.title}
                        </span>
                      </div>
                    }
                    action={
                      <Badge
                        variant={isCompleted ? 'success' : asmt.type === 'quiz' ? 'info' : 'warning'}
                        size="sm"
                      >
                        {isCompleted ? 'Completed' : asmt.type.toUpperCase()}
                      </Badge>
                    }
                  />

                  <CardContent className="space-y-3 pt-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {asmt.instructions}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Total Marks</span>
                        <span className="font-bold text-slate-800">{asmt.totalMarks} Marks</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Duration</span>
                        <span className="font-bold text-slate-800">{asmt.durationMinutes} Minutes</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Deadline</span>
                        <span className="font-bold text-slate-800">
                          {new Date(asmt.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    {asmt.questions?.length > 0 ? `${asmt.questions.length} MCQ Questions` : 'Written / Lab Submission'}
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Score: {submission?.score}/{submission?.totalMarks}</span>
                    </div>
                  ) : asmt.type === 'quiz' ? (
                    <Link to={`/student/assessments/take/${asmt.id}`}>
                      <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Start Test
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info('Submission guidelines downloaded. Please hand in your report during lab hours.')}
                    >
                      View Submission Details
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab 2: Submissions & Score History */}
      {activeTab === 'submissions' && (
        <Card>
          <CardHeader
            title="Continuous Internal Evaluation Scorebook"
            subtitle="Official recorded grades and faculty feedback"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Evaluation Title</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4">Score Awarded</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Faculty Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map(subm => {
                  const asmt = assessments.find(a => a.id === subm.assessmentId);
                  const sub = asmt ? subjectsMap[asmt.subjectId] : null;
                  const pct = subm.score ? Math.round((subm.score / subm.totalMarks) * 100) : 0;

                  return (
                    <tr key={subm.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {asmt?.title || 'Mid-Term Exam'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-blue-600 font-bold mr-1">{sub?.code}</span>
                        <span className="text-slate-700">{sub?.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {new Date(subm.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                        {subm.score} / {subm.totalMarks}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={pct >= 75 ? 'success' : pct >= 50 ? 'warning' : 'danger'} size="sm">
                          {pct}%
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 italic text-[11px] max-w-xs">
                        {subm.feedback || 'Evaluated.'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Previous Year Question Papers (PYQs) */}
      {activeTab === 'pyqs' && (
        <Card>
          <CardHeader
            title="University Previous Year Question Papers (PYQ Repository)"
            subtitle="Curated question papers from 2023 - 2025 examination cycles"
            action={
              <select
                value={selectedPyqSubject}
                onChange={e => setSelectedPyqSubject(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none"
              >
                <option value="all">All Subjects</option>
                {Object.values(subjectsMap).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            }
          />
          <div className="divide-y divide-slate-100">
            {pyqs
              .filter(p => selectedPyqSubject === 'all' || p.subjectId === selectedPyqSubject)
              .map(paper => (
                <div key={paper.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-bold text-blue-600">{paper.subjectCode}</span>
                        <h4 className="text-sm font-semibold text-slate-900">{paper.subjectName}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Year: <strong>{paper.year}</strong></span>
                        <span>•</span>
                        <span>{paper.examType}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">{paper.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => handleDownloadPyq(paper)}
                  >
                    Download PDF
                  </Button>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
};
