'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Bookmark } from '@/lib/types';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (verseKey: string) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('quranBookmarks');
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error("Failed to load bookmarks from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
      } catch (error) {
        console.error("Failed to save bookmarks to localStorage", error);
      }
    }
  }, [bookmarks, isLoaded]);

  const addBookmark = (bookmark: Bookmark) => {
    setBookmarks((prev) => [...prev, bookmark]);
  };

  const removeBookmark = (verseKey: string) => {
    setBookmarks((prev) => prev.filter((b) => b.verse_key !== verseKey));
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark }}>
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
