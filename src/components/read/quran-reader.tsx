'use client';

import { useState } from 'react';
import { surahs } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioPlayer } from './audio-player';
import type { Verse } from '@/lib/types';

export function QuranReader() {
  const [selectedSurahId, setSelectedSurahId] = useState<string>(surahs[0].id.toString());
  const [translation, setTranslation] = useState<'english' | 'indonesian'>('english');
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);

  const selectedSurah = surahs.find(s => s.id.toString() === selectedSurahId) || surahs[0];

  const handlePlay = (verseId: number) => {
    setPlayingVerse(verseId);
  };
  
  const handleNext = () => {
    if (playingVerse === null) {
      setPlayingVerse(selectedSurah.verses[0].id);
      return;
    }
    const currentIndex = selectedSurah.verses.findIndex(v => v.id === playingVerse);
    if (currentIndex < selectedSurah.verses.length - 1) {
      setPlayingVerse(selectedSurah.verses[currentIndex + 1].id);
    }
  };
  
  const handlePrev = () => {
     if (playingVerse === null) return;
    const currentIndex = selectedSurah.verses.findIndex(v => v.id === playingVerse);
    if (currentIndex > 0) {
      setPlayingVerse(selectedSurah.verses[currentIndex - 1].id);
    }
  };


  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-muted/50 p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Surah</label>
              <Select value={selectedSurahId} onValueChange={setSelectedSurahId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Surah" />
                </SelectTrigger>
                <SelectContent>
                  {surahs.map((surah) => (
                    <SelectItem key={surah.id} value={surah.id.toString()}>
                      {surah.id}. {surah.name} ({surah.englishName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Translation</label>
              <Select value={translation} onValueChange={(val: 'english' | 'indonesian') => setTranslation(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Translation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="indonesian">Indonesian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <AudioPlayer 
                isPlaying={playingVerse !== null}
                onPlayPause={() => playingVerse ? setPlayingVerse(null) : handlePlay(selectedSurah.verses[0].id)}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8 font-body text-lg">
          <h2 className="text-4xl font-arabic text-center font-bold text-primary" dir="rtl">
            {selectedSurah.name}
          </h2>
          {selectedSurah.verses.map((verse: Verse) => (
            <div key={verse.id} className={`p-4 rounded-lg ${playingVerse === verse.id ? 'bg-secondary' : ''}`}>
              <p className="text-3xl leading-relaxed text-right font-arabic" dir="rtl">
                {verse.arabic} <span className="text-sm text-accent font-sans">({verse.id})</span>
              </p>
              <p className="mt-4 text-muted-foreground">{verse[translation]}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
