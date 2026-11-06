import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import {
  Inbox,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Filter,
  Search,
  ExternalLink,
  Award,
} from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';
import { StudentSubmission, Assessment } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const FacultySubmissions: React.FC = () => {
  const toast = useToast();
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [subList, asmtList] = await Promise.all([
          assessmentService.getSubmissions(),
          assessmentService.getAssessments(),
        ]);
        setSubmissions(subList);
        setAssessments(asmtList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = submissions.filter(
    s => selectedAssessmentId === 'all' || s.assessmentId === selectedAssessmentId
  );

  const handleOpenGradeModal = (sub: StudentSubmission) => {
    setSelectedSubmission(sub);
    setGradeInput(sub.score || 25);
    setFeedbackInput(sub.feedback || 'Good work on algorithm explanation. Enhance boundary case handling.');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      await assessmentService.gradeSubmission(selectedSubmission.id, Number(gradeInput), feedbackInput);
      setSubmissions(prev =>
        prev.map(s =>
          s.id === selectedSubmission.id
            ? { ...s, score: Number(gradeInput), feedback: feedbackInput, status: 'graded' }
            : s
        )
      );
      toast.success(`Score of ${gradeInput} awarded to ${selectedSubmission.studentName || 'Student'}.`);
      setSelectedSubmission(null);
    } catch (err) {
      toast.error('Failed to save score.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Assignment & Lab Submissions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, evaluate and assign marks for student laboratory assignments and quizzes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedAssessmentId}
            onChange={e => setSelectedAssessmentId(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Assessments ({assessments.length})</option>
            {assessments.map(a => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Evaluated marks list exported (Excel).')}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Marks
          </Button>
        </div>
      </div>

      {/* Submissions List Table */}
      <Card className="overflow-x-auto">
        <CardContent className="p-0">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="p-3">Submission ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Assessment Title</th>
                <th className="p-3">Submitted At</th>
                <th className="p-3">Score Awarded</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(sub => {
                const asmt = assessments.find(a => a.id === sub.assessmentId);
                const sName = sub.studentName || 'Aarav Sharma';

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-slate-500">{sub.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{sName}</td>
                    <td className="p-3 text-slate-700">{asmt?.title || 'Assignment'}</td>
                    <td className="p-3 font-mono text-slate-500">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {sub.score !== undefined ? `${sub.score} / ${asmt?.totalMarks || 50}` : '—'}
                    </td>
                    <td className="p-3">
                      {sub.status === 'graded' ? (
                        <Badge variant="success">Graded</Badge>
                      ) : (
                        <Badge variant="warning">Needs Evaluation</Badge>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant={sub.status === 'graded' ? 'outline' : 'teal'}
                        size="sm"
                        className="text-[11px] py-1"
                        onClick={() => handleOpenGradeModal({ ...sub, studentName: sName })}
                      >
                        {sub.status === 'graded' ? 'Re-grade' : 'Grade Submission'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Grading Modal */}
      {selectedSubmission && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSubmission(null)}
          title={`Grade Submission: ${selectedSubmission.studentName || 'Student'}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <p className="font-semibold text-slate-900">
                Student: {selectedSubmission.studentName}
              </p>
              <p className="text-slate-500">
                Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marks Awarded (Max 30)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                required
                className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono font-bold text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={gradeInput}
                onChange={e => setGradeInput(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty Feedback & Rubric Notes
              </label>
              <textarea
                rows={3}
                required
                className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={feedbackInput}
                onChange={e => setFeedbackInput(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" type="button" onClick={() => setSelectedSubmission(null)}>
                Cancel
              </Button>
              <Button variant="teal" type="submit">
                Submit Grade
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
