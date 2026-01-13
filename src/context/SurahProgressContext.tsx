
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

interface SurahProgressContextType {
  progress: { [surahId: number]: number };
  updateProgress: (surahId: number, percentage: number) => void;
}

const SurahProgressContext = createContext<SurahProgressContextType | undefined>(undefined);

export const SurahProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<{ [surahId: number]: number }>({});

  const { user } = useAuth();

  // Load progress
  useEffect(() => {
    async function loadProgress() {
      if (user) {
        try {
          const snapshot = await getDocs(collection(db, 'users', user.uid, 'progress'));
          const cloudProgress: { [key: number]: number } = {};
          snapshot.docs.forEach(doc => {
            cloudProgress[Number(doc.id)] = doc.data().percentage;
          });
          setProgress(cloudProgress);
        } catch (error) {
          console.error("Failed to load progress from Firestore", error);
        }
      } else {
        const savedProgress = localStorage.getItem('quranSurahProgress');
        if (savedProgress && Object.keys(JSON.parse(savedProgress)).length > 0) {
          setProgress(JSON.parse(savedProgress));
        }
      }
    }
    loadProgress();
  }, [user]);

  // Sync to LocalStorage (guest/backup)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('quranSurahProgress', JSON.stringify(progress));
    }
  }, [progress, user]);

  const updateProgress = async (surahId: number, percentage: number) => {
    const val = Math.min(100, Math.max(0, percentage));

    setProgress((prev) => ({
      ...prev,
      [surahId]: val,
    }));

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'progress', surahId.toString()), {
          percentage: val,
          updatedAt: new Date()
        });
      } catch (e) {
        console.error("Error syncing progress to cloud:", e);
      }
    }
  };

  return (
    <SurahProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </SurahProgressContext.Provider>
  );
};

export const useSurahProgress = () => {
  const context = useContext(SurahProgressContext);
  if (context === undefined) {
    throw new Error('useSurahProgress must be used within a SurahProgressProvider');
  }
  return context;
};
