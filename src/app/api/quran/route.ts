
import { NextResponse } from 'next/server';

const QURAN_API_URL = 'https://api.quran.com/api/v4';

// A helper function to fetch data and handle errors
async function fetchFromQuranApi(path: string) {
  const res = await fetch(`${QURAN_API_URL}/${path}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(`Failed to fetch ${path}: ${errorData.message || res.statusText}`);
  }
  return res.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const surahId = searchParams.get('surah');
  // Expect a single translation ID
  const translationId = searchParams.get('translations'); 

  if (!surahId) {
    try {
      const data = await fetchFromQuranApi('chapters');
      return NextResponse.json(data);
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  if (!translationId) {
      return new NextResponse(
        JSON.stringify({ message: 'Translation ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
  }

  try {
    // Fetch verses and the single requested translation in parallel
    const versesPromise = fetchFromQuranApi(`quran/verses/uthmani?chapter_number=${surahId}`);
    const translationPromise = fetchFromQuranApi(`quran/translations/${translationId}?chapter_number=${surahId}`);

    const [versesData, translationData] = await Promise.all([versesPromise, translationPromise]);

    // Create a simple map for faster lookups: verse_key -> translation_text
    const translationsMap = new Map<string, string>();
    translationData.translations.forEach((t: { verse_key: string; text: string }) => {
        // Strip out HTML tags like <sup> which are common in some translations
        const cleanedText = t.text.replace(/<[^>]*>/g, '');
        translationsMap.set(t.verse_key, cleanedText);
    });
    
    // Attach the mapped translation to each verse
    const combinedVerses = versesData.verses.map((verse: any) => ({
      id: verse.id,
      verse_key: verse.verse_key,
      arabic: verse.text_uthmani,
      translation: translationsMap.get(verse.verse_key) || ''
    }));

    return NextResponse.json({
      verses: combinedVerses,
    });

  } catch (error: any) {
    console.error(`Error fetching data for Surah ${surahId}:`, error);
    return new NextResponse(
      JSON.stringify({ message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
