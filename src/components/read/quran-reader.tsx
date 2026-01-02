
'use client';

import { useState, useRef, useEffect } from 'react';
import { surahs, reciters } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioPlayer } from './audio-player';
import type { Verse } from '@/lib/types';

export function QuranReader() {
  const [isClient, setIsClient] = useState(false);
  const [selectedSurahId, setSelectedSurahId] = useState<string>(surahs[0].id.toString());
  const [translation, setTranslation] = useState<'english' | 'indonesian'>('english');
  const [selectedReciterId, setSelectedReciterId] = useState<string>(reciters[0].id);
  
  const [currentVerseId, setCurrentVerseId] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const selectedSurah = surahs.find(s => s.id.toString() === selectedSurahId) || surahs[0];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const constructAudioUrl = (surahId: number, verseId: number, reciterId: string) => {
    const reciterIdForUrl = reciterId.replace(/_128kbps/g, '');
    const surahIdPadded = surahId.toString().padStart(3, '0');
    const verseIdPadded = verseId.toString().padStart(3, '0');
    return `https://everyayah.com/data/${reciterIdForUrl}/${surahIdPadded}${verseIdPadded}.mp3`;
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentVerseId(null);
    setAudioUrl('');
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  };

  // Effect to stop playback when surah or reciter changes
  useEffect(() => {
    stopPlayback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSurahId, selectedReciterId]);

  
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
        if (currentVerseId !== null) {
            audioRef.current?.play().catch(e => console.error("Audio play failed on resume:", e));
        } else if (selectedSurah.verses.length > 0){
            // Start from the first verse if nothing is playing
            const firstVerseId = selectedSurah.verses[0].id;
            setCurrentVerseId(firstVerseId);
            setAudioUrl(constructAudioUrl(selectedSurah.id, firstVerseId, selectedReciterId));
        }
    }
  };

  const playNextVerse = () => {
    if (currentVerseId === null) return;
    const currentVerseIndex = selectedSurah.verses.findIndex(v => v.id === currentVerseId);
    const nextVerse = selectedSurah.verses[currentVerseIndex + 1];
    if (nextVerse) {
      setCurrentVerseId(nextVerse.id);
      setAudioUrl(constructAudioUrl(selectedSurah.id, nextVerse.id, selectedReciterId));
    } else {
      stopPlayback(); // End of surah
    }
  };
  
  const playPrevVerse = () => {
    if (currentVerseId === null) return;
    const currentVerseIndex = selectedSurah.verses.findIndex(v => v.id === currentVerseId);
    if (currentVerseIndex > 0) {
      const prevVerse = selectedSurah.verses[currentVerseIndex - 1];
      setCurrentVerseId(prevVerse.id);
      setAudioUrl(constructAudioUrl(selectedSurah.id, prevVerse.id, selectedReciterId));
    }
  };

  const handleVerseClick = (verseId: number) => {
    if (currentVerseId === verseId) {
      handlePlayPause();
    } else {
      setCurrentVerseId(verseId);
      setAudioUrl(constructAudioUrl(selectedSurah.id, verseId, selectedReciterId));
    }
  };

  const handleSurahChange = (surahId: string) => {
    setSelectedSurahId(surahId);
  };
  
  if (!isClient) {
    return null;
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
                onNext={playNextVerse}
                onPrev={playPrevVerse}
                selectedReciterId={selectedReciterId}
                onReciterChange={setSelectedReciterId}
              />
            </div>
          </div>
        </div>
        
        <audio 
            ref={audioRef}
            src={audioUrl}
            autoPlay={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={playNextVerse}
            onError={(e) => {
              console.error(`Audio Error: Failed to load source ${audioUrl}`, e);
              setIsPlaying(false);
            }}
        />

        <div className="p-6 space-y-8 font-body text-lg">
          <h2 className="text-4xl font-arabic text-center font-bold text-primary" dir="rtl">
            {selectedSurah.name}
          </h2>
          {selectedSurah.verses.map((verse: Verse) => (
            <div key={verse.id} className={`p-4 rounded-lg cursor-pointer transition-colors ${currentVerseId === verse.id ? 'bg-secondary' : 'hover:bg-muted/50'}`} onClick={() => handleVerseClick(verse.id)}>
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
