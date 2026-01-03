
import { NextResponse } from 'next/server';

// A helper function to fetch original Quranic text (Uthmani script) from quran.com API v4
async function fetchOriginalVerses(surahId: string) {
  try {
    const res = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahId}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch original verses from quran.com: ${errorData.message || res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching original verses:", error);
    throw new Error("Could not connect to the Quran API for Arabic text.");
  }
}

// A helper function to fetch a specific translation from quran.com API v4
async function fetchTranslation(translationId: string, surahId: string) {
    try {
      const res = await fetch(`https://api.quran.com/api/v4/quran/translations/${translationId}?chapter_number=${surahId}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to fetch translation from quran.com: ${errorData.message || res.statusText}`);
      }
      return res.json();
    } catch (error) {
      console.error(`Error fetching translation ${translationId}:`, error);
      throw new Error("Could not connect to the Quran API for translations.");
    }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const surahId = searchParams.get('surah');
  const translationId = searchParams.get('translations');

  if (!surahId) {
    return new NextResponse(
      JSON.stringify({ message: 'Surah ID is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Fetch both original verses and translations in parallel
    const [versesData, translationData] = await Promise.all([
      fetchOriginalVerses(surahId),
      translationId ? fetchTranslation(translationId, surahId) : Promise.resolve(null)
    ]);
    
    // Create a map for quick lookup: verse_key -> translation_text
    const translationsMap = new Map<string, string>();
    if (translationData) {
        translationData.translations.forEach((t: { verse_key: string; text: string }) => {
            // The API sometimes returns HTML entities, let's clean them up.
            const cleanedText = t.text.replace(/<[^>]*>/g, '');
            translationsMap.set(t.verse_key, cleanedText);
        });
    }

    // Combine original verses with their corresponding translations
    const combinedVerses = versesData.verses.map((verse: any) => ({
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
