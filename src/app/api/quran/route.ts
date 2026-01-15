
import { NextResponse } from 'next/server';
import { activeTranslation } from '@/lib/data';

async function fetchSurahData(surahId: string, translationId: string) {
  // This endpoint can fetch the verse and its translation in a single call.
  // We specify which translation we want and set a per_page limit.
  // Surah 2 (Al-Baqarah) has 286 ayahs, so 300 is sufficient for any single Surah.
  const url = `https://api.quran.com/api/v4/verses/by_chapter/${surahId}?language=en&words=false&translations=${translationId}&fields=text_uthmani&per_page=300`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch surah data from quran.com: ${errorData.message || res.statusText}`);
    }
    const data = await res.json();
    return data.verses;

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
    const versesFromApi = await fetchSurahData(surahId, translationId);

    // The API returns the translation inside a `translations` array on each verse object.
    // We need to map this to our simplified `Verse` type.
    const combinedVerses = versesFromApi.map((verse: any) => ({
      id: verse.id,
      verse_key: verse.verse_key,
      arabic: verse.text_uthmani,
      // The translation is in the first element of the translations array
      translation: verse.translations[0]?.text.replace(/<[^>]*>/g, '') || ''
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
