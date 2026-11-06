import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assessmentService } from '../../services/assessmentService';
import { academicService } from '../../services/academicService';
import { Assessment, Subject, StudentSubmission } from '../../types/academic';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  ChevronRight,
  Home,
} from 'lucide-react';

export const StudentTestTaking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60); // 15 mins
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultSubmission, setResultSubmission] = useState<StudentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTest() {
      try {
        setIsLoading(true);
        const testId = id || 'asmt-001';
        const asmt = await assessmentService.getAssessmentById(testId);
        if (asmt) {
          setAssessment(asmt);
          setTimeLeftSeconds(asmt.durationMinutes * 60);
          const sub = await academicService.getSubjectById(asmt.subjectId);
          if (sub) setSubject(sub);
        }
      } catch (err) {
        console.error('Failed to load test', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTest();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (resultSubmission || timeLeftSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resultSubmission, timeLeftSeconds]);

  const handleSelectOption = (qId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmitTest = async () => {
    if (!assessment) return;
    try {
      setIsSubmitting(true);
      const submission = await assessmentService.submitTest(assessment.id, user.id, answers);
      setResultSubmission(submission);
      setIsSubmitDialogOpen(false);
      toast.success('Assessment submitted and evaluated successfully!');
    } catch (err) {
      toast.error('Failed to record submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !assessment) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 text-sm">Loading assessment environment...</p>
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentQIndex];
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const isTimeCritical = timeLeftSeconds < 120; // under 2 mins

  // --- RESULT VIEW IF ALREADY SUBMITTED ---
  if (resultSubmission) {
    const score = resultSubmission.score || 0;
    const total = resultSubmission.totalMarks;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4 animate-in fade-in duration-300">
        {/* Score Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center shadow-xs">
          <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Assessment Results: {assessment.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Course: <strong>{subject?.code} - {subject?.name}</strong> · Submitted on {new Date().toLocaleTimeString()}
          </p>

          <div className="my-6 inline-flex items-baseline gap-2 bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl">
            <span className="text-4xl font-extrabold text-blue-600">{score}</span>
            <span className="text-xl text-slate-400 font-medium">/ {total} Marks</span>
            <Badge variant={percentage >= 75 ? 'success' : 'warning'} size="sm" className="ml-3">
              {percentage}% ({percentage >= 75 ? 'Distinction' : 'Pass'})
            </Badge>
          </div>

          <p className="text-xs text-slate-600 max-w-lg mx-auto bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            {resultSubmission.feedback}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/student/assessments">
              <Button variant="outline" size="sm">
                Back to Assessments
              </Button>
            </Link>
            <Link to="/student">
              <Button size="sm" leftIcon={<Home className="w-4 h-4" />}>
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Detailed Question Explanations */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            Answer Review & Faculty Explanations
          </h3>

          {questions.map((q, idx) => {
            const studentAns = answers[q.id];
            const isCorrect = studentAns === q.correctAnswer;

            return (
              <Card key={q.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-xs text-slate-400 mt-0.5">Q{idx + 1}.</span>
                    <h4 className="text-sm font-medium text-slate-900 leading-snug">{q.text}</h4>
                  </div>
                  <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                    {isCorrect ? `+${q.marks} Marks` : '0 Marks'}
                  </Badge>
                </div>

                {/* Options List */}
                <div className="space-y-2 pt-2">
                  {q.options?.map((opt, oIdx) => {
                    const isSelected = studentAns === oIdx;
                    const isKey = q.correctAnswer === oIdx;

                    let optStyle = 'border-slate-200 bg-white text-slate-700';
                    if (isKey) {
                      optStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium';
                    } else if (isSelected && !isKey) {
                      optStyle = 'border-rose-400 bg-rose-50/70 text-rose-950';
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-lg border text-xs flex items-center justify-between ${optStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isKey && (
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                          </span>
                        )}
                        {isSelected && !isKey && (
                          <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Your Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation text */}
                {q.explanation && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <strong className="text-slate-800 font-semibold block mb-0.5">Faculty Explanation:</strong>
                    {q.explanation}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // --- LIVE TEST TAKING VIEW ---
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Test Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-10 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-blue-600">{subject?.code}</span>
            <Badge variant="neutral" size="sm">
              Continuous Internal Evaluation (CIE)
            </Badge>
          </div>
          <h2 className="text-base font-bold text-slate-900">{assessment.title}</h2>
        </div>

        {/* Live Timer */}
        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border font-mono text-sm font-bold ${
            isTimeCritical
              ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
              : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-sans font-normal text-slate-500">remaining</span>
        </div>
      </div>

      {/* Main Test Body */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left: Question Card (3 cols) */}
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader
              title={`Question ${currentQIndex + 1} of ${questions.length}`}
              subtitle={`Marks: ${currentQ?.marks || 5}`}
              action={
                <Badge variant={answers[currentQ?.id] !== undefined ? 'success' : 'neutral'} size="sm">
                  {answers[currentQ?.id] !== undefined ? 'Answered' : 'Unanswered'}
                </Badge>
              }
            />

            <CardContent className="space-y-5">
              <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                {currentQ?.text}
              </p>

              {currentQ?.codeSnippet && (
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              )}

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ?.options?.map((opt, oIdx) => {
                  const isSelected = answers[currentQ.id] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, oIdx)}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 text-blue-950 font-medium ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {currentQIndex < questions.length - 1 ? (
                  <Button
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => setCurrentQIndex(prev => prev + 1)}
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setIsSubmitDialogOpen(true)}
                  >
                    Submit Test Now
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right: Question Navigation Palette */}
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
              Question Palette
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentQIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center cursor-pointer transition-colors ${
                      isCurrent
                        ? 'ring-2 ring-blue-600 bg-blue-100 text-blue-800'
                        : isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-600" />
                <span>Answered ({Object.keys(answers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200" />
                <span>Unattempted ({questions.length - Object.keys(answers).length})</span>
              </div>
            </div>

            <Button
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
              size="sm"
              onClick={() => setIsSubmitDialogOpen(true)}
            >
              Submit Assessment
            </Button>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        onConfirm={handleSubmitTest}
        title="Submit Continuous Assessment?"
        message={`You have answered ${Object.keys(answers).length} out of ${questions.length} questions. Once submitted, your score and detailed answer explanations will be calculated immediately.`}
        confirmText="Confirm & Submit"
        isLoading={isSubmitting}
      />
    </div>
  );
};
