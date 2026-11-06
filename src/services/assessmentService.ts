import {
  Assessment,
  StudentSubmission,
  PreviousYearPaper,
} from '../types/academic';
import {
  MOCK_ASSESSMENTS,
  MOCK_SUBMISSIONS,
  MOCK_PYQS,
} from './mockData';

let assessmentsStore: Assessment[] = [...MOCK_ASSESSMENTS];
let submissionsStore: StudentSubmission[] = [...MOCK_SUBMISSIONS];
let pyqStore: PreviousYearPaper[] = [...MOCK_PYQS];

export const assessmentService = {
  // Get all assessments (filtered optionally by section)
  async getAssessments(sectionId?: string): Promise<Assessment[]> {
    if (sectionId) {
      return Promise.resolve(assessmentsStore.filter(a => a.sectionId === sectionId));
    }
    return Promise.resolve([...assessmentsStore]);
  },

  async getAssessmentById(id: string): Promise<Assessment | undefined> {
    return Promise.resolve(assessmentsStore.find(a => a.id === id));
  },

  // Faculty: Create assessment
  async createAssessment(data: Omit<Assessment, 'id' | 'createdAt'>): Promise<Assessment> {
    const newAssessment: Assessment = {
      ...data,
      id: `asmt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    assessmentsStore = [newAssessment, ...assessmentsStore];
    return Promise.resolve(newAssessment);
  },

  // Submissions
  async getSubmissions(assessmentId?: string, studentId?: string): Promise<StudentSubmission[]> {
    let result = [...submissionsStore];
    if (assessmentId) {
      result = result.filter(s => s.assessmentId === assessmentId);
    }
    if (studentId) {
      result = result.filter(s => s.studentId === studentId);
    }
    return Promise.resolve(result);
  },

  // Student: Submit test attempt
  async submitTest(assessmentId: string, studentId: string, answers: Record<string, string | number>): Promise<StudentSubmission> {
    const assessment = assessmentsStore.find(a => a.id === assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    // Auto-grade MCQs if questions exist
    let calculatedScore = 0;
    if (assessment.questions && assessment.questions.length > 0) {
      assessment.questions.forEach(q => {
        const studentAns = answers[q.id];
        if (studentAns !== undefined && studentAns === q.correctAnswer) {
          calculatedScore += q.marks;
        }
      });
    } else {
      // Mock grade for open submission
      calculatedScore = Math.floor(assessment.totalMarks * 0.85);
    }

    const newSubmission: StudentSubmission = {
      id: `subm-${Date.now()}`,
      assessmentId,
      studentId,
      submittedAt: new Date().toISOString(),
      score: calculatedScore,
      totalMarks: assessment.totalMarks,
      status: 'graded',
      answers,
      feedback: calculatedScore >= assessment.totalMarks * 0.75
        ? 'Great performance! Concepts are clear and well applied.'
        : 'Good attempt. Review the detailed explanations to improve on weaker topics.',
    };

    submissionsStore = [newSubmission, ...submissionsStore];
    return Promise.resolve(newSubmission);
  },

  // Previous Year Papers
  async getPYQs(subjectId?: string): Promise<PreviousYearPaper[]> {
    if (subjectId) {
      return Promise.resolve(pyqStore.filter(p => p.subjectId === subjectId));
    }
    return Promise.resolve([...pyqStore]);
  },

  // Faculty: Update submission score/feedback
  async gradeSubmission(submissionId: string, score: number, feedback: string): Promise<StudentSubmission> {
    submissionsStore = submissionsStore.map(s => (s.id === submissionId ? { ...s, score, feedback, status: 'graded' } : s));
    const updated = submissionsStore.find(s => s.id === submissionId);
    if (!updated) throw new Error('Submission not found');
    return Promise.resolve(updated);
  },
};
