import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  FileSpreadsheet,
  Plus,
  Upload,
  Calendar,
  Clock,
  Award,
  Users,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';
import { academicService } from '../../services/academicService';
import { Assessment, StudentSubmission, Subject, Section, AssessmentType } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const FacultyAssessments: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjectsMap, setSubjectsMap] = useState<Record<string, Subject>>({});

  // Create modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState('sub-cs301');
  const [newSectionId, setNewSectionId] = useState('sec-cse-5a');
  const [newType, setNewType] = useState<AssessmentType>('quiz');
  const [newMarks, setNewMarks] = useState(25);
  const [newDuration, setNewDuration] = useState(30);
  const [newDeadline, setNewDeadline] = useState('2026-11-05T23:59');
  const [newInstructions, setNewInstructions] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');

  // Grading modal state
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(0);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [asmts, subms, subList, secList] = await Promise.all([
          assessmentService.getAssessments(),
          assessmentService.getSubmissions(),
          academicService.getSubjects(),
          academicService.getSections(),
        ]);

        const sMap = subList.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
        setAssessments(asmts);
        setSubmissions(subms);
        setSubjects(subList);
        setSections(secList);
        setSubjectsMap(sMap);
      } catch (err) {
        console.error('Failed to load faculty assessment management', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter an assessment title');
      return;
    }

    try {
      const created = await assessmentService.createAssessment({
        title: newTitle,
        subjectId: newSubjectId,
        sectionId: newSectionId,
        type: newType,
        totalMarks: Number(newMarks),
        durationMinutes: Number(newDuration),
        deadline: newDeadline,
        instructions: newInstructions || 'Standard academic examination guidelines apply.',
        questions: [],
        isPublished: true,
      });

      setAssessments([created, ...assessments]);
      setIsCreateModalOpen(false);
      // Reset form
      setNewTitle('');
      setNewInstructions('');
      setAttachedFileName('');
      toast.success(`Assessment "${created.title}" created and published to students!`);
    } catch (err) {
      toast.error('Failed to create assessment');
    }
  };

  const handleOpenGradeModal = (subm: StudentSubmission) => {
    setSelectedSubmission(subm);
    setGradeScore(subm.score || 0);
    setGradeFeedback(subm.feedback || '');
  };

  const handleSaveGrade = async () => {
    if (!selectedSubmission) return;
    try {
      const updated = await assessmentService.gradeSubmission(selectedSubmission.id, gradeScore, gradeFeedback);
      setSubmissions(prev => prev.map(s => (s.id === updated.id ? updated : s)));
      setSelectedSubmission(null);
      toast.success('Grade and feedback updated successfully');
    } catch (err) {
      toast.error('Failed to save grade');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Assessment Management & Grading
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure continuous evaluation tests, attach question papers, and audit student scores.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Assessment
        </Button>
      </div>

      {/* Active Assessments Table */}
      <Card>
        <CardHeader
          title="Scheduled Assessments & Tests"
          subtitle="All continuous internal evaluation (CIE) components"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Title & Course</th>
                <th className="py-3 px-4">Evaluation Type</th>
                <th className="py-3 px-4">Marks & Duration</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Submissions Received</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessments.map(asmt => {
                const sub = subjectsMap[asmt.subjectId];
                const count = submissions.filter(s => s.assessmentId === asmt.id).length;

                return (
                  <tr key={asmt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-sm">{asmt.title}</div>
                      <div className="font-mono text-xs text-blue-600">
                        {sub?.code} · {sub?.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={asmt.type === 'quiz' ? 'info' : 'purple'} size="sm">
                        {asmt.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-bold text-slate-900">{asmt.totalMarks} Marks</span>
                      <span className="text-slate-400 block">{asmt.durationMinutes} mins</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {new Date(asmt.deadline).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {count > 0 ? `${count} submitted` : 'Pending student attempts'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge variant="success" size="sm">
                        Published
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student Submissions & Grading Roster */}
      <Card>
        <CardHeader
          title="Student Submissions & Scorebook"
          subtitle="Review answers, update scores, and enter official CIE feedback"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student ID / Name</th>
                <th className="py-3 px-4">Assessment</th>
                <th className="py-3 px-4">Submitted Timestamp</th>
                <th className="py-3 px-4">Score Awarded</th>
                <th className="py-3 px-4">Feedback Remarks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map(subm => {
                const asmt = assessments.find(a => a.id === subm.assessmentId);
                const sub = asmt ? subjectsMap[asmt.subjectId] : null;

                return (
                  <tr key={subm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {subm.studentId === 'user-std-001' ? 'Aarav Sharma (1CS23CS001)' : 'Priya Patel (1CS23CS002)'}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Section CSE-5A</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">{asmt?.title || 'Mid-Term 1'}</span>
                      <span className="font-mono text-[11px] text-blue-600">{sub?.code}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {new Date(subm.submittedAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                      {subm.score} / {subm.totalMarks}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-xs italic">
                      {subm.feedback || 'No comments.'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleOpenGradeModal(subm)}
                      >
                        Edit Grade / Review
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Assessment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Continuous Assessment"
        subtitle="Publish a quiz, mid-term evaluation, or lab test for enrolled students"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateAssessment} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Assessment Title *</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Quiz 3: Dynamic Programming & Shortest Paths"
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Course *</label>
              <select
                value={newSubjectId}
                onChange={e => setNewSubjectId(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Section *</label>
              <select
                value={newSectionId}
                onChange={e => setNewSectionId(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {sections.map(sec => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name} ({sec.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Evaluation Type</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="quiz">Timed Quiz (MCQ)</option>
                <option value="midterm">Mid-Term CIE Exam</option>
                <option value="assignment">Assignment / Report</option>
                <option value="lab_test">In-Lab Practical Test</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Total Marks</label>
              <input
                type="number"
                min="5"
                max="100"
                value={newMarks}
                onChange={e => setNewMarks(Number(e.target.value))}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="10"
                max="180"
                value={newDuration}
                onChange={e => setNewDuration(Number(e.target.value))}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Submission Deadline</label>
            <input
              type="datetime-local"
              value={newDeadline}
              onChange={e => setNewDeadline(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Exam Instructions / Rubric</label>
            <textarea
              rows={3}
              value={newInstructions}
              onChange={e => setNewInstructions(e.target.value)}
              placeholder="Enter instructions, prohibited items, or evaluation rubrics..."
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Question Paper attachment mock */}
          <div className="p-3 border border-dashed border-slate-200 rounded-lg bg-slate-50 text-center">
            <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-600 font-medium">Attach Question Paper or Answer Scheme (Optional)</p>
            <p className="text-[10px] text-slate-400">PDF, DOCX up to 10 MB</p>
            {attachedFileName ? (
              <span className="inline-block mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Attached: {attachedFileName}
              </span>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => setAttachedFileName('CS301_Quiz3_QuestionPaper_Official.pdf')}
              >
                Simulate Attach PDF
              </Button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Publish Assessment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Grade / Review Submission Modal */}
      {selectedSubmission && (
        <Modal
          isOpen={Boolean(selectedSubmission)}
          onClose={() => setSelectedSubmission(null)}
          title="Review & Grade Student Submission"
          subtitle="Enter Continuous Internal Evaluation score and comments"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="font-semibold text-slate-900 block">Student: Aarav Sharma (1CS23CS001)</span>
              <span className="text-slate-500 block">Total Marks Allotted: {selectedSubmission.totalMarks} Marks</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Awarded Marks</label>
              <input
                type="number"
                min="0"
                max={selectedSubmission.totalMarks}
                value={gradeScore}
                onChange={e => setGradeScore(Number(e.target.value))}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Faculty Feedback & Corrections</label>
              <textarea
                rows={4}
                value={gradeFeedback}
                onChange={e => setGradeFeedback(e.target.value)}
                placeholder="Enter feedback for student..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveGrade}>
                Save Score & Comments
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
