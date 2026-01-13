"use client";

import { db } from './firebase.client';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export interface TafsirData {
  verse_key: string;
  surah: number;
  ayah: number;
  text: string;
  ayah_keys: string[];
  language: string;
  author: string;
}

// Cache for tafsir data to minimize Firestore reads
const tafsirCache = new Map<string, TafsirData>();

/**
 * Fetch tafsir for a specific verse
 * Uses client-side caching to minimize database reads
 */
export async function getTafsirByVerse(verseKey: string): Promise<TafsirData | null> {
  // Check cache first
  if (tafsirCache.has(verseKey)) {
    return tafsirCache.get(verseKey)!;
  }

  try {
    const docRef = doc(db, 'tafsir', verseKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as TafsirData;
      tafsirCache.set(verseKey, data);
      return data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching tafsir:', error);
    return null;
  }
}

/**
 * Fetch tafsir for an entire surah
 * Useful for pre-loading when user opens a surah
 */
export async function getTafsirBySurah(surahNumber: number): Promise<TafsirData[]> {
  try {
    const q = query(
      collection(db, 'tafsir'),
      where('surah', '==', surahNumber)
    );

    const querySnapshot = await getDocs(q);
    const tafsirs: TafsirData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as TafsirData;
      tafsirs.push(data);
      // Cache each entry
      tafsirCache.set(data.verse_key, data);
    });

    return tafsirs.sort((a, b) => a.ayah - b.ayah);
  } catch (error) {
    console.error('Error fetching surah tafsir:', error);
    return [];
  }
}

/**
 * Prefetch tafsir for a surah in the background
 * Call this when user navigates to a surah page
 */
export function prefetchSurahTafsir(surahNumber: number): void {
  getTafsirBySurah(surahNumber).catch((error) => {
    console.error('Error prefetching tafsir:', error);
  });
}

/**
 * Clear the tafsir cache
 * Useful for memory management
 */
export function clearTafsirCache(): void {
  tafsirCache.clear();
}
