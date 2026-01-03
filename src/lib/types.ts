
export interface Verse {
  id: number;
  arabic: string;
  verse_key: string;
  translation: string; // Simplified
  translations: { [key: string]: string }; // Kept for compatibility if needed elsewhere
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  verses: Verse[];
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
    id: number;
    language: string;
    name: string;
    author_name: string;
}
