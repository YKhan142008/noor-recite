'use client';

import { useState, useRef, useEffect } from 'react';
import { surahs, reciters } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioPlayer } from './audio-player';
import type { Verse } from '@/lib/types';

export function QuranReader() {
  const [selectedSurahId, setSelectedSurahId] = useState<string>(surahs[0].id.toString());
  const [translation, setTranslation] = useState<'english' | 'indonesian'>('english');
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const [selectedReciterId, setSelectedReciterId] = useState<string>(reciters[0].id);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const selectedSurah = surahs.find(s => s.id.toString() === selectedSurahId) || surahs[0];
  
  const constructAudioUrl = (verseId: number) => {
    const reciterIdForUrl = selectedReciterId.replace('_128kbps', '');
    const surahIdPadded = selectedSurah.id.toString().padStart(3, '0');
    const verseIdPadded = verseId.toString().padStart(3, '0');
    return `https://everyayah.com/data/${reciterIdForUrl}/${surahIdPadded}${verseIdPadded}.mp3`;
  };

  const playVerse = (verseId: number) => {
    if (audioRef.current) {
      const audioUrl = constructAudioUrl(verseId);
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setPlayingVerse(verseId);
    }
  }

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingVerse(null);
    setIsPlaying(false);
  }

  useEffect(() => {
    // Stop playback when surah or reciter changes
    stopPlayback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSurahId, selectedReciterId]);
  
  const handleNext = () => {
    if (!playingVerse) return;
    const currentIndex = selectedSurah.verses.findIndex(v => v.id === playingVerse);
    if (currentIndex !== -1 && currentIndex < selectedSurah.verses.length - 1) {
      playVerse(selectedSurah.verses[currentIndex + 1].id);
    } else {
      stopPlayback(); // End of surah
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: ErrorEvent) => {
        console.error("Audio Error:", e);
        setIsPlaying(false);
    };

    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleNext);
    audioElement.addEventListener('error', handleError);

    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioElement.removeEventListener('ended', handleNext);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioElement.removeEventListener('error', handleError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingVerse, selectedSurah.id]); // Re-attach listeners if surah or verse changes
  
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
        if (playingVerse !== null) {
            audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
        } else if (selectedSurah.verses.length > 0){
            playVerse(selectedSurah.verses[0].id);
        }
    }
  };
  
  const handlePrev = () => {
    if (!playingVerse) return;
    const currentIndex = selectedSurah.verses.findIndex(v => v.id === playingVerse);
    if (currentIndex > 0) {
      playVerse(selectedSurah.verses[currentIndex - 1].id);
    }
  };

  const handleVerseClick = (verseId: number) => {
    if (playingVerse === verseId && isPlaying) {
      audioRef.current?.pause();
    } else {
      playVerse(verseId);
    }
  };

  const handleSurahChange = (surahId: string) => {
    setSelectedSurahId(surahId);
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-muted/50 p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Surah</label>
              <Select value={selectedSurahId} onValueChange={handleSurahChange}>
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
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrev={handlePrev}
                selectedReciterId={selectedReciterId}
                onReciterChange={setSelectedReciterId}
              />
            </div>
          </div>
        </div>
        <audio ref={audioRef} />

        <div className="p-6 space-y-8 font-body text-lg">
          <h2 className="text-4xl font-arabic text-center font-bold text-primary" dir="rtl">
            {selectedSurah.name}
          </h2>
          {selectedSurah.verses.map((verse: Verse) => (
            <div key={verse.id} className={`p-4 rounded-lg cursor-pointer transition-colors ${playingVerse === verse.id ? 'bg-secondary' : 'hover:bg-muted/50'}`} onClick={() => handleVerseClick(verse.id)}>
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
