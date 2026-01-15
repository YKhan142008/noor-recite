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
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }
    // Try direct document fetch first (most efficient)
    const docRef = doc(db!, 'tafsir', verseKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as TafsirData;
      // Cache this specific verse key
      tafsirCache.set(verseKey, data);

      // Also cache all other ayahs in this group if they exist
      if (data.ayah_keys && Array.isArray(data.ayah_keys)) {
        data.ayah_keys.forEach(key => tafsirCache.set(key, data));
      }

      return data;
    }

    // If not found directly, it might be part of a group but stored under a different key
    // Perform a query for the grouping
    const q = query(
      collection(db!, 'tafsir'),
      where('ayah_keys', 'array-contains', verseKey)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data() as TafsirData;

      // Cache all keys in this group to avoid future queries
      if (data.ayah_keys && Array.isArray(data.ayah_keys)) {
        data.ayah_keys.forEach(key => tafsirCache.set(key, data));
      } else {
        tafsirCache.set(verseKey, data);
      }

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
    if (!db) {
      console.warn('Firestore not initialized');
      return [];
    }
    const q = query(
      collection(db!, 'tafsir'),
      where('surah', '==', surahNumber)
    );

    const querySnapshot = await getDocs(q);
    const tafsirs: TafsirData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as TafsirData;
      tafsirs.push(data);

      // Cache the primary verse key
      tafsirCache.set(data.verse_key, data);

      // Also cache each ayah key in the group if it's a multi-ayah tafsir
      if (data.ayah_keys && Array.isArray(data.ayah_keys)) {
        data.ayah_keys.forEach(key => {
          tafsirCache.set(key, data);
        });
      }
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
