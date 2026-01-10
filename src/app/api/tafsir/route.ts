
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { Tafsir } from '@/lib/types';

// This function reads the local JSON file.
// It's cached by Next.js in production builds.
async function getTafsirData(): Promise<Tafsir[]> {
  const jsonPath = path.join(process.cwd(), 'src', 'lib', 'tafsir', 'en-ibn-kathir.json');
  try {
    const fileContent = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(fileContent);
    return data.tafsir; // Assuming the root object has a "tafsir" key
  } catch (error) {
    console.error("Failed to read or parse tafsir file:", error);
    // In a real app, you might want more robust error handling.
    // For now, we return an empty array if the file is missing or invalid.
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const surahId = searchParams.get('surah');
  const verseId = searchParams.get('verse');

  if (!surahId || !verseId) {
    return new NextResponse(
      JSON.stringify({ message: 'Surah and Verse IDs are required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const allTafsirs = await getTafsirData();
    
    const surahNum = parseInt(surahId, 10);
    const verseNum = parseInt(verseId, 10);

    // Find the specific tafsir for the requested surah and verse
    const tafsir = allTafsirs.find(t => t.surah === surahNum && t.verse === verseNum);

    if (tafsir) {
      return NextResponse.json(tafsir);
    } else {
      return new NextResponse(
        JSON.stringify({ message: 'Tafsir not found for this verse.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error(`Error processing tafsir request for ${surahId}:${verseId}:`, error);
    return new NextResponse(
      JSON.stringify({ message: 'An internal server error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
