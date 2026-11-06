import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  MessageSquareHeart,
  Star,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Award,
  Send,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { Subject, Faculty, FacultyFeedbackRecord } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const StudentFeedback: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [submittedFeedback, setSubmittedFeedback] = useState<FacultyFeedbackRecord[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Ratings 1-5
  const [ratings, setRatings] = useState({
    subjectKnowledge: 5,
    clarityAndDelivery: 4,
    punctuality: 5,
    labGuidanceAndPractical: 5,
  });

  const [comments, setComments] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [subList, facList, fbList] = await Promise.all([
          academicService.getSubjects(),
          academicService.getFaculty(),
          academicService.getFacultyFeedbackList(),
        ]);
        setSubjects(subList);
        setFacultyList(facList);
        setSubmittedFeedback(fbList.filter(f => f.studentId === user.id));
        if (subList.length > 0) {
          setSelectedSubjectId(subList[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const assignedFaculty = facultyList.find(f => f.id === selectedSubject?.facultyId);
  const hasAlreadySubmitted = submittedFeedback.some(f => f.subjectId === selectedSubjectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !assignedFaculty) return;

    const overallRating = Math.round(
      (ratings.subjectKnowledge +
        ratings.clarityAndDelivery +
        ratings.punctuality +
        ratings.labGuidanceAndPractical) /
        4
    );

    try {
      const newRecord = await academicService.submitFacultyFeedback({
        studentId: user.id,
        facultyId: assignedFaculty.id,
        subjectId: selectedSubject.id,
        ratings,
        overallRating,
        comments,
      });

      toast.success(`Confidential feedback submitted for ${assignedFaculty.name}!`);
      setSubmittedFeedback(prev => [...prev, newRecord]);
      setComments('');
    } catch (err) {
      toast.error('Failed to submit feedback.');
    }
  };

  const renderStarSelector = (key: keyof typeof ratings, label: string) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-200 bg-white gap-2">
      <span className="text-xs font-semibold text-slate-800">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            type="button"
            key={star}
            onClick={() => setRatings(prev => ({ ...prev, [key]: star }))}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              ratings[key] >= star ? 'text-amber-500 hover:text-amber-600' : 'text-slate-200 hover:text-slate-300'
            }`}
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-xs font-bold text-slate-700 w-6 text-right">
          {ratings[key]}/5
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Confidential Faculty Teaching Feedback
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional quality evaluation for academic teaching and lab guidance (Semester 5).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-teal-50 text-teal-800 border border-teal-200 px-3 py-2 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>All submissions are 100% anonymized before reaching HOD or faculty.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subject Selector & Submitted status */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Enrolled Subjects" subtitle="Select a course to evaluate" />
            <CardContent className="space-y-2">
              {subjects.map(sub => {
                const isDone = submittedFeedback.some(f => f.subjectId === sub.id);
                const isSelected = sub.id === selectedSubjectId;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold font-mono text-teal-700 block">
                        {sub.code}
                      </span>
                      <span className="text-xs font-medium text-slate-800 line-clamp-1">
                        {sub.name}
                      </span>
                    </div>

                    {isDone ? (
                      <span className="text-emerald-700 font-semibold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right 2 Columns: Evaluation Form */}
        <div className="lg:col-span-2">
          {selectedSubject && assignedFaculty && (
            <Card>
              <CardHeader
                title={`Faculty Feedback: ${assignedFaculty.name}`}
                subtitle={`Evaluation for ${selectedSubject.name} (${selectedSubject.code})`}
              />
              <CardContent>
                {hasAlreadySubmitted ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      Feedback Submitted Successfully
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Thank you for submitting your feedback for {assignedFaculty.name}. Your responses have been securely cataloged and aggregated for Dean review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                        {assignedFaculty.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{assignedFaculty.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          {assignedFaculty.department} • Cabin: {assignedFaculty.cabin}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {renderStarSelector('subjectKnowledge', '1. Depth of Subject Knowledge & Conceptual Clarity')}
                      {renderStarSelector('clarityAndDelivery', '2. Delivery Pace, Audio-Visuals & Classroom Interaction')}
                      {renderStarSelector('punctuality', '3. Punctuality & Structured Lecture Coverage')}
                      {renderStarSelector('labGuidanceAndPractical', '4. Guidance during Lab Sessions & Continuous Evaluations')}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Constructive Comments & Suggestions (Optional)
                      </label>
                      <textarea
                        rows={3}
                        className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Mention any specific lecture topics that were particularly helpful or areas for improvement..."
                        value={comments}
                        onChange={e => setComments(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-100">
                      <Button variant="teal" type="submit">
                        <Send className="w-4 h-4 mr-1.5" />
                        Submit Evaluation
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
