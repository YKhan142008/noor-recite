
import { NextResponse } from 'next/server';

const QURAN_API_URL = 'https://api.quran.com/api/v4';
// Translation IDs: 131 for English (Saheeh International), 33 for Indonesian
const TRANSLATION_IDS = '131,33'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const surahId = searchParams.get('surah');

  if (!surahId) {
    // Fetch list of all surahs if no ID is provided
    try {
      const res = await fetch(`${QURAN_API_URL}/chapters`);
      if (!res.ok) throw new Error('Failed to fetch chapters list');
      const data = await res.json();
      return NextResponse.json(data);
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Fetch content for a specific surah
  try {
    const [versesRes, translationsRes, indonesianTranslationsRes] = await Promise.all([
      fetch(`${QURAN_API_URL}/quran/verses/uthmani?chapter_number=${surahId}`),
      fetch(`${QURAN_API_URL}/quran/translations/131?chapter_number=${surahId}`), // English
      fetch(`${QURAN_API_URL}/quran/translations/33?chapter_number=${surahId}`), // Indonesian
    ]);

    if (!versesRes.ok) throw new Error('Failed to fetch verses.');
    if (!translationsRes.ok) throw new Error('Failed to fetch English translations.');
    if (!indonesianTranslationsRes.ok) throw new Error('Failed to fetch Indonesian translations.');

    const versesData = await versesRes.json();
    const translationsData = await translationsRes.json();
    const indonesianTranslationsData = await indonesianTranslationsRes.json();

    return NextResponse.json({
      verses: versesData.verses,
      translations: translationsData.translations,
      indonesianTranslations: indonesianTranslationsData.translations
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
