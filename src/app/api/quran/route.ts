
import { NextResponse } from 'next/server';
import { activeTranslation } from '@/lib/data';

// This new helper function fetches both verses and a specific translation in one go.
async function fetchSurahData(surahId: string, translationId: string) {
  // This endpoint gets the Uthmani script and attaches the requested translation.
  const fields = 'text_uthmani';
  const url = `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahId}&fields=${fields}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch original verses from quran.com: ${errorData.message || res.statusText}`);
    }
    const verseData = await res.json();

    const translationUrl = `https://api.quran.com/api/v4/quran/translations/${translationId}?chapter_number=${surahId}`;
    const transRes = await fetch(translationUrl);
     if (!transRes.ok) {
      const errorData = await transRes.json().catch(() => ({}));
      throw new Error(`Failed to fetch translation from quran.com: ${errorData.message || transRes.statusText}`);
    }
    const translationData = await transRes.json();
    
    return { verses: verseData.verses, translations: translationData.translations };

  } catch (error) {
    console.error("Error fetching surah data:", error);
    throw new Error("Could not connect to the Quran API.");
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const surahId = searchParams.get('surah');
  
  // The translationId is now fixed to the one defined in lib/data.ts
  const translationId = activeTranslation.id;

  if (!surahId) {
    return new NextResponse(
      JSON.stringify({ message: 'Surah ID is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Fetch both original verses and the fixed translation in parallel
    const { verses, translations } = await fetchSurahData(surahId, translationId);
    
    // Create a map for quick lookup: verse_key -> translation_text
    const translationsMap = new Map<string, string>();
    translations.forEach((t: { verse_key: string; text: string }) => {
        // The API sometimes returns HTML entities, let's clean them up.
        const cleanedText = t.text.replace(/<[^>]*>/g, '');
        translationsMap.set(t.verse_key, cleanedText);
    });

    // Combine original verses with their corresponding translations
    const combinedVerses = verses.map((verse: any) => ({
      id: verse.id,
      verse_key: verse.verse_key,
      arabic: verse.text_uthmani,
      translation: translationsMap.get(verse.verse_key) || '' // Fallback to empty string if no translation found
    }));

    return NextResponse.json({
      verses: combinedVerses,
    });

  } catch (error: any) {
    console.error(`Error processing request for Surah ${surahId}:`, error);
    return new NextResponse(
      JSON.stringify({ message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
