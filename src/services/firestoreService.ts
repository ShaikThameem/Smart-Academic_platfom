import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Complaint, FacultyFeedbackRecord, Announcement, AttendanceRecord } from '../types/academic';

/**
 * Service for Firestore real-time and persistent operations with strict error handling.
 */

// ================= COMPLAINTS / GRIEVANCES ================= //

export async function submitComplaintToFirestore(
  complaintData: Omit<Complaint, 'id' | 'createdAt' | 'status'>
): Promise<Complaint> {
  const collectionPath = 'complaints';
  const id = `cmp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const currentUid = auth.currentUser?.uid || 'anonymous-std';
  const currentName = auth.currentUser?.displayName || complaintData.studentName || 'Student';

  const newComplaint = {
    id,
    studentId: currentUid,
    studentName: complaintData.isAnonymous ? 'Anonymous Student' : currentName,
    title: complaintData.title || 'Student Grievance',
    category: complaintData.category || 'Academic',
    description: complaintData.description,
    status: 'open' as const,
    isAnonymous: Boolean(complaintData.isAnonymous),
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, collectionPath, id), newComplaint);
    return newComplaint;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionPath}/${id}`);
  }
}

export async function fetchStudentComplaintsFromFirestore(): Promise<Complaint[]> {
  const collectionPath = 'complaints';
  const currentUid = auth.currentUser?.uid;

  try {
    let q;
    if (currentUid) {
      q = query(collection(db, collectionPath), where('studentId', '==', currentUid), limit(50));
    } else {
      q = query(collection(db, collectionPath), limit(20));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as Complaint);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionPath);
  }
}

// ================= FACULTY FEEDBACK ================= //

export async function submitFeedbackToFirestore(
  feedbackData: {
    facultyId: string;
    facultyName?: string;
    subjectId: string;
    subjectName?: string;
    ratingClarity: number;
    ratingPunctuality: number;
    ratingKnowledge: number;
    ratingFairness: number;
    comments: string;
  }
): Promise<FacultyFeedbackRecord> {
  const collectionPath = 'feedback';
  const id = `fbk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const currentUid = auth.currentUser?.uid || 'anonymous-std';

  const newFeedback: FacultyFeedbackRecord = {
    id,
    studentId: currentUid,
    facultyId: feedbackData.facultyId,
    facultyName: feedbackData.facultyName,
    subjectId: feedbackData.subjectId,
    subjectName: feedbackData.subjectName,
    ratingClarity: feedbackData.ratingClarity,
    ratingPunctuality: feedbackData.ratingPunctuality,
    ratingKnowledge: feedbackData.ratingKnowledge,
    ratingFairness: feedbackData.ratingFairness,
    comments: feedbackData.comments,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, collectionPath, id), newFeedback);
    return newFeedback;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionPath}/${id}`);
  }
}

// ================= ANNOUNCEMENTS ================= //

export async function fetchAnnouncementsFromFirestore(): Promise<Announcement[]> {
  const collectionPath = 'announcements';
  try {
    const q = query(collection(db, collectionPath), limit(25));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as Announcement);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionPath);
  }
}

export async function createAnnouncementInFirestore(
  announcement: Omit<Announcement, 'id' | 'date'>
): Promise<Announcement> {
  const collectionPath = 'announcements';
  const id = `ann-${Date.now()}`;
  const currentUid = auth.currentUser?.uid || 'admin-uid';
  const currentName = auth.currentUser?.displayName || announcement.author || 'Dean Academic Affairs';

  const newDoc: Announcement = {
    id,
    title: announcement.title,
    content: announcement.content,
    category: announcement.category,
    date: new Date().toISOString().split('T')[0],
    author: currentName,
    isImportant: Boolean(announcement.isImportant),
  };

  try {
    await setDoc(doc(db, collectionPath, id), {
      ...newDoc,
      authorId: currentUid,
      authorName: currentName,
      createdAt: new Date().toISOString(),
    });
    return newDoc;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionPath}/${id}`);
  }
}
