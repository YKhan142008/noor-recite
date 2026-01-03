
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
  // Expect a comma-separated list of translation IDs
  const translationIdsParam = searchParams.get('translations');
  
  // Default to English (Saheeh International) and Indonesian if not specified
  const translationIds = translationIdsParam ? translationIdsParam.split(',') : ['131', '33'];

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

  try {
    // Fetch verses and all requested translations in parallel
    const versesPromise = fetchFromQuranApi(`quran/verses/uthmani?chapter_number=${surahId}`);
    const translationsPromises = translationIds.map(id => 
      fetchFromQuranApi(`quran/translations/${id}?chapter_number=${surahId}`)
    );

    const [versesData, ...translationsDataArray] = await Promise.all([versesPromise, ...translationsPromises]);

    // Combine translations into a more useful structure
    const translationsMap = new Map<string, { [key: string]: string }>();
    translationsDataArray.forEach((transData, index) => {
        const transId = translationIds[index];
        transData.translations.forEach((t: { verse_key: string; text: string }) => {
            if (!translationsMap.has(t.verse_key)) {
                translationsMap.set(t.verse_key, {});
            }
            const verseTranslations = translationsMap.get(t.verse_key)!;
            verseTranslations[transId] = t.text.replace(/<sup[^>]*>.*?<\/sup>/g, '');
        });
    });
    
    // Attach the mapped translations to each verse
    const combinedVerses = versesData.verses.map((verse: any) => ({
      ...verse,
      arabic: verse.text_uthmani,
      translations: translationsMap.get(verse.verse_key) || {},
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
