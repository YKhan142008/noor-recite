
export interface Verse {
  id: number;
  arabic: string;
  english: string;
  indonesian: string;
  verse_key?: string;
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
