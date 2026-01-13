'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Bookmark } from '@/lib/types';
import { useSurahProgress } from './SurahProgressContext';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (verseKey: string) => void;
  jumpToBookmark: (bookmark: Bookmark) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { updateProgress } = useSurahProgress();
  const { user } = useAuth(); // Assuming useAuth is available via imports

  // Load bookmarks (Firestore if logged in, otherwise LocalStorage)
  useEffect(() => {
    async function loadBookmarks() {
      if (user) {
        try {
          const q = query(collection(db, 'users', user.uid, 'bookmarks'), orderBy('surahId'));
          const snapshot = await getDocs(q);
          const cloudBookmarks = snapshot.docs.map(doc => doc.data() as Bookmark);
          setBookmarks(cloudBookmarks);
        } catch (error) {
          console.error("Failed to load bookmarks from Firestore", error);
        }
      } else {
        try {
          const savedBookmarks = localStorage.getItem('quranBookmarks');
          if (savedBookmarks) {
            setBookmarks(JSON.parse(savedBookmarks));
          }
        } catch (error) {
          console.error("Failed to load bookmarks from localStorage", error);
        }
      }
      setIsLoaded(true);
    }
    loadBookmarks();
  }, [user]);

  // Sync to LocalStorage (as backup/guest)
  useEffect(() => {
    if (isLoaded && !user) {
      localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks, isLoaded, user]);

  const addBookmark = async (bookmark: Bookmark) => {
    setBookmarks((prev) => [...prev, bookmark]);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'bookmarks', bookmark.verse_key), bookmark);
      } catch (e) {
        console.error("Error saving bookmark to cloud:", e);
      }
    }
  };

  const removeBookmark = async (verseKey: string) => {
    setBookmarks((prev) => prev.filter((b) => b.verse_key !== verseKey));

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'bookmarks', verseKey));
      } catch (e) {
        console.error("Error removing bookmark from cloud:", e);
      }
    }
  };

  const jumpToBookmark = (bookmark: Bookmark) => {
    if (bookmark.progress !== undefined) {
      updateProgress(bookmark.surahId, bookmark.progress);
    }
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, jumpToBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
