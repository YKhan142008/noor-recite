
export interface Verse {
  id: number;
  verse_key: string;
  arabic: string;
  translation: string;
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  verses: Verse[];
  total_verses: number;
}

export interface Reciter {
  id: string;
  name: string;
  audio_url_path: string;
}

export interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

export interface ReadingActivity {
  day: string;
  minutes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  imageId: string;
}

export interface Translation {
    id: string; 
    language: string;
    name: string;
    author_name: string;
}

export interface Bookmark {
  surahId: number;
  surahName: string;
  verse_key: string;
  text: string;
}

