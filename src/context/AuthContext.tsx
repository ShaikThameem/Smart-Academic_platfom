import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '../types/academic';
import { MOCK_USERS } from '../services/mockData';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  FirebaseUser,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  role: Role;
  user: User;
  switchRole: (newRole: Role) => void;
  isStudent: boolean;
  isFaculty: boolean;
  isHod: boolean;
  isAuthenticated: boolean;
  firebaseUser: FirebaseUser | null;
  isFirebaseConnected: boolean;
  login: (email: string, role?: Role) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => void;
  previewNoticeDismissed: boolean;
  dismissPreviewNotice: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('smart_academic_role');
    return (saved as Role) || 'student';
  });

  const [previewNoticeDismissed, setPreviewNoticeDismissed] = useState<boolean>(false);
  const dismissPreviewNotice = () => setPreviewNoticeDismissed(true);

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseConnected] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('smart_academic_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return MOCK_USERS[role] || MOCK_USERS.student;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Sync role changes
  const switchRole = (newRole: Role) => {
    setRole(newRole);
    const targetUser = {
      ...(MOCK_USERS[newRole] || MOCK_USERS.student),
      ...(firebaseUser
        ? {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || currentUser.name,
            email: firebaseUser.email || currentUser.email,
            avatar: firebaseUser.photoURL || currentUser.avatar,
            role: newRole,
          }
        : {}),
    };
    setCurrentUser(targetUser);
    localStorage.setItem('smart_academic_role', newRole);
    localStorage.setItem('smart_academic_user', JSON.stringify(targetUser));
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setIsAuthenticated(true);
        // Check if user has an assigned profile in Firestore
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);

          let userRole: Role = role;
          if (fbUser.email === 'thameemahmed087@gmail.com') {
            userRole = 'hod';
          }

          if (snap.exists()) {
            const data = snap.data();
            const loadedUser: User = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'College User',
              email: fbUser.email || '',
              role: (data.role as Role) || userRole,
              avatar: fbUser.photoURL || currentUser.avatar,
              department: data.department || 'Computer Science & Engineering',
              codeNumber: data.codeNumber || (userRole === 'student' ? '1CS23CS001' : 'EMP-CSE-101'),
              sectionId: data.sectionId || 'sec-cse-5a',
              semester: data.semester || 5,
            };
            setCurrentUser(loadedUser);
            setRole(loadedUser.role);
            localStorage.setItem('smart_academic_role', loadedUser.role);
            localStorage.setItem('smart_academic_user', JSON.stringify(loadedUser));
          } else {
            // First time Google login -> write to Firestore
            const initialUser: User = {
              id: fbUser.uid,
              name: fbUser.displayName || 'College User',
              email: fbUser.email || '',
              role: userRole,
              avatar: fbUser.photoURL || currentUser.avatar,
              department: 'Computer Science & Engineering',
              codeNumber: userRole === 'student' ? '1CS23CS001' : 'EMP-CSE-101',
              sectionId: 'sec-cse-5a',
              semester: 5,
            };

            await setDoc(userDocRef, {
              id: initialUser.id,
              name: initialUser.name,
              email: initialUser.email,
              role: initialUser.role,
              department: initialUser.department,
              codeNumber: initialUser.codeNumber,
              sectionId: initialUser.sectionId,
              semester: initialUser.semester,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            setCurrentUser(initialUser);
            setRole(userRole);
            localStorage.setItem('smart_academic_role', userRole);
            localStorage.setItem('smart_academic_user', JSON.stringify(initialUser));
          }
        } catch (err) {
          console.warn('Could not sync Firestore profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [role]);

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Firebase Google sign-in failed:', err);
      return false;
    }
  };

  const login = async (email: string, specifiedRole?: Role): Promise<boolean> => {
    // Role detection fallback for prototyping
    let detectedRole: Role = specifiedRole || 'student';
    if (!specifiedRole) {
      if (email.includes('hod') || email === 'thameemahmed087@gmail.com') detectedRole = 'hod';
      else if (email.includes('faculty') || email.includes('rajesh') || email.includes('prof')) detectedRole = 'faculty';
    }

    switchRole(detectedRole);
    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
    setFirebaseUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    console.info(`Password reset link requested for ${email}`);
    return true;
  };

  const updateProfile = (updates: Partial<User>) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('smart_academic_user', JSON.stringify(updated));

    // If authenticated with Firebase, also persist to Firestore
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(
        userRef,
        {
          name: updated.name,
          phone: updated.phone || '',
          department: updated.department,
          codeNumber: updated.codeNumber,
          sectionId: updated.sectionId || '',
          semester: updated.semester || 5,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch((err) => handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser?.uid}`));
    }
  };

  useEffect(() => {
    localStorage.setItem('smart_academic_role', role);
  }, [role]);

  return (
    <AuthContext.Provider
      value={{
        role,
        user: currentUser,
        switchRole,
        isStudent: role === 'student',
        isFaculty: role === 'faculty',
        isHod: role === 'hod',
        isAuthenticated,
        firebaseUser,
        isFirebaseConnected,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfile,
        previewNoticeDismissed,
        dismissPreviewNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
