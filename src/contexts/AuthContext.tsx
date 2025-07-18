import React, { createContext, useContext, useEffect, useState } from 'react';
import { app } from '../lib/firebase';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  DocumentData,
  QueryDocumentSnapshot,
  onSnapshot,
} from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

interface User {
  id: string;
  email: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  fees_paid: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  students: Student[];
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  updateFeeStatus: (id: string, paid: boolean) => void;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signUpWithGoogle: (name: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoaded, setStudentsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const studentRef = doc(db, 'students', firebaseUser.uid);
        const studentSnap = await getDoc(studentRef);
        let name = '';
        if (studentSnap.exists()) {
          name = studentSnap.data().name || '';
        } else if (firebaseUser.displayName) {
          name = firebaseUser.displayName;
        }
        setUser({ id: firebaseUser.uid, email: firebaseUser.email || '', name });
      } else {
        setUser(null);
        setStudents([]);
        setStudentsLoaded(false);
        setLoading(false);
      }
    });

    const studentsCol = collection(db, 'students');
    const unsubscribeStudents = onSnapshot(
      studentsCol,
      (snapshot) => {
        const studentsList: Student[] = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Student[];
        setStudents(studentsList);
        setStudentsLoaded(true);
        if (user) {
          setLoading(false); // Only stop loading when both user and students are ready
        }
      },
      (error) => {
        console.error('Error in students snapshot:', error);
        setStudentsLoaded(true); // Mark as loaded to avoid infinite loading
        setLoading(false);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeStudents();
    };
  }, [user]);

  const signUp = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const newStudent: Student = {
        id: firebaseUser.uid,
        name,
        email,
        fees_paid: false,
        created_at: new Date().toISOString(),
      };
      await setDoc(doc(db, 'students', firebaseUser.uid), newStudent);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = () => {
    firebaseSignOut(auth);
    setUser(null);
    setStudents([]);
    setStudentsLoaded(false);
    setLoading(false);
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const studentRef = doc(db, 'students', id);
      await updateDoc(studentRef, updates);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const updateFeeStatus = async (id: string, paid: boolean) => {
    await updateStudent(id, { fees_paid: paid });
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const studentRef = doc(db, 'students', firebaseUser.uid);
      const studentSnap = await getDoc(studentRef);
      if (!studentSnap.exists()) {
        const newStudent: Student = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          fees_paid: false,
          created_at: new Date().toISOString(),
        };
        await setDoc(studentRef, newStudent);
      }
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signUpWithGoogle = async (name: string): Promise<{ error?: string }> => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const studentRef = doc(db, 'students', firebaseUser.uid);
      const newStudent: Student = {
        id: firebaseUser.uid,
        name: name || firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        fees_paid: false,
        created_at: new Date().toISOString(),
      };
      await setDoc(studentRef, newStudent);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const value = {
    user,
    loading,
    students,
    signUp,
    signIn,
    signOut,
    updateStudent,
    updateFeeStatus,
    signInWithGoogle,
    signUpWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};