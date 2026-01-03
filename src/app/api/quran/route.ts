
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// A helper function to fetch original Quranic text (Uthmani script)
async function fetchOriginalVerses(surahId: string) {
  try {
    const res = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahId}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch original verses: ${errorData.message || res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching original verses:", error);
    throw new Error("Could not connect to the Quran API for Arabic text.");
  }
}

// A helper function to get translation data from local JSON files
async function getTranslation(translationId: string, surahId: string) {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'translations', `${translationId}.json`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const translationData = JSON.parse(fileContent);

    // Filter translations for the requested surah
    const surahTranslations = translationData.translations.filter(
        (t: { surah: number; }) => t.surah.toString() === surahId
    );
    return surahTranslations;

  } catch (error) {
    console.error(`Error reading or parsing translation file for ${translationId}:`, error);
    // If the file doesn't exist or is invalid, return an empty array
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const surahId = searchParams.get('surah');
  const translationId = searchParams.get('translations'); // e.g., 'en-hilalikhan'

  // If no surahId is provided, we can't do anything useful.
  if (!surahId) {
    return new NextResponse(
      JSON.stringify({ message: 'Surah ID is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Fetch original Arabic text
    const versesData = await fetchOriginalVerses(surahId);
    
    // Get translations from local files if a translationId is provided
    let translations: any[] = [];
    if (translationId) {
      translations = await getTranslation(translationId, surahId);
    }
    
    // Create a map for quick lookup: verse_key -> translation_text
    const translationsMap = new Map<string, string>();
    translations.forEach((t: { verse: number; text: string }) => {
        const verse_key = `${surahId}:${t.verse}`;
        // Strip out HTML tags like <sup> which are common in some translations
        const cleanedText = t.text.replace(/<[^>]*>/g, '');
        translationsMap.set(verse_key, cleanedText);
    });

    // Combine original verses with translations
    const combinedVerses = versesData.verses.map((verse: any) => ({
      id: verse.id,
      verse_key: verse.verse_key,
      arabic: verse.text_uthmani,
      translation: translationsMap.get(verse.verse_key) || '' // Fallback to empty string
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
