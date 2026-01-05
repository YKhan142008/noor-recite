
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SurahProgressContextType {
  progress: { [surahId: number]: number };
  updateProgress: (surahId: number, percentage: number) => void;
}

const SurahProgressContext = createContext<SurahProgressContextType | undefined>(undefined);

export const SurahProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<{ [surahId: number]: number }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('quranSurahProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Failed to load surah progress from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('quranSurahProgress', JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to save surah progress to localStorage", error);
      }
    }
  }, [progress, isLoaded]);

  const updateProgress = (surahId: number, percentage: number) => {
    setProgress((prev) => ({
      ...prev,
      [surahId]: Math.min(100, Math.max(0, percentage)), // Clamp between 0 and 100
    }));
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
