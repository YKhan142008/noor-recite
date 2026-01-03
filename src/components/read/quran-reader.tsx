'use client';

import { useState, useEffect, useRef } from 'react';
import { allSurahs as surahs, reciters } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioPlayer } from './audio-player';
import type { Verse, Surah, Reciter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function verseKeyToEveryAyahId(verseKey: string) {
  if (!verseKey) return '';
  const [surah, ayah] = verseKey.split(":");
  return `${surah.padStart(3, "0")}${ayah.padStart(3, "0")}`;
}

export function QuranReader() {
  const [isClient, setIsClient] = useState(false);
  const [selectedSurahId, setSelectedSurahId] = useState<string>('1');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [translation, setTranslation] = useState<'english' | 'indonesian'>('english');
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(reciters[0]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentVerseKey, setCurrentVerseKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const verseRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchSurahContent = async (surahId: string) => {
    setIsLoading(true);
    if (isPlaying) stopPlayback();

    try {
      const response = await fetch(`/api/quran?surah=${surahId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch surah content');
      }
      const data = await response.json();
      
      const surahInfo = surahs.find(s => s.id.toString() === surahId);
      if (!surahInfo) throw new Error('Surah not found in metadata');

      const fetchedVerses: Verse[] = data.verses.map((v: any) => ({
        id: v.verse_number,
        arabic: v.text_uthmani,
        english: data.translations.find((t: any) => t.verse_key === v.verse_key)?.text || '',
        indonesian: data.indonesianTranslations.find((t: any) => t.verse_key === v.verse_key)?.text || '',
        verse_key: v.verse_key,
      }));

      setSelectedSurah({
        ...surahInfo,
        verses: fetchedVerses,
      });
      setCurrentVerseKey(null);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load Surah',
        description: (error as Error).message || 'Could not retrieve the content for this surah.',
      });
      setSelectedSurah(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSurahId) {
      fetchSurahContent(selectedSurahId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSurahId]);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
  };
  
  const playVerse = (verseKey: string) => {
    const verse = selectedSurah?.verses.find(v => v.verse_key === verseKey);
    if (!verse) return;

    const fileId = verseKeyToEveryAyahId(verseKey);
    const audioUrl = `https://everyayah.com/data/${selectedReciter.audio_url_path}/${fileId}.mp3`;
    
    if (audioRef.current) {
        audioRef.current.src = `/api/audio?url=${encodeURIComponent(audioUrl)}`;
        audioRef.current.load();
        audioRef.current.play().catch(e => {
            console.error("Audio play failed:", e);
            toast({
              variant: "destructive",
              title: "Audio Playback Error",
              description: "Could not play the requested audio file.",
            });
            setIsPlaying(false);
        });
    }

    setCurrentVerseKey(verseKey);
    setIsPlaying(true);
    
    // Scroll to the verse
    verseRefs.current[verseKey]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    });
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (currentVerseKey) {
        // Resume playing current verse
        audioRef.current?.play().catch(e => console.error("Audio resume failed:", e));
        setIsPlaying(true);
      } else if (selectedSurah?.verses.length) {
        // Start playing from the first verse
        const firstVerseKey = selectedSurah.verses[0]?.verse_key;
        if (firstVerseKey) playVerse(firstVerseKey);
      }
    }
  };

  const playNextVerse = () => {
    if (!currentVerseKey || !selectedSurah) return;
    const currentIndex = selectedSurah.verses.findIndex(v => v.verse_key === currentVerseKey);
    if (currentIndex > -1 && currentIndex < selectedSurah.verses.length - 1) {
      const nextVerseKey = selectedSurah.verses[currentIndex + 1].verse_key;
      playVerse(nextVerseKey);
    } else {
      stopPlayback();
    }
  };
  
  const playPrevVerse = () => {
    if (!currentVerseKey || !selectedSurah) return;
    const currentIndex = selectedSurah.verses.findIndex(v => v.verse_key === currentVerseKey);
    if (currentIndex > 0) {
      const prevVerseKey = selectedSurah.verses[currentIndex - 1].verse_key;
      playVerse(prevVerseKey);
    }
  };

  const handleVerseClick = (verse: Verse) => {
    if (currentVerseKey === verse.verse_key && isPlaying) {
      handlePlayPause(); // Pause if clicking the currently playing verse
    } else {
      playVerse(verse.verse_key);
    }
  };
  
  const onAudioEnded = () => {
    playNextVerse();
  };

  const onAudioError = () => {
    toast({
      variant: "destructive",
      title: "Audio Playback Error",
      description: "Could not play the audio file. The reciter may not have a recording for this verse or there was a network issue.",
    });
    setIsPlaying(false);
  };
  
  const handleReciterChange = (reciterId: string) => {
    const newReciter = reciters.find(r => r.id === reciterId);
    if (newReciter) {
        stopPlayback();
        setSelectedReciter(newReciter);
    }
  };

  if (!isClient) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-muted/50 p-4 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="md:col-span-3">
                <Skeleton className="h-[76px] w-full" />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-8">
            <Skeleton className="h-12 w-1/2 mx-auto" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const showBismillah = selectedSurah && selectedSurah.id !== 1 && selectedSurah.id !== 9;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-muted/50 p-4 border-b sticky top-[56px] z-40">
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
                </Trigger>
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
                selectedReciterId={selectedReciter.id}
                onReciterChange={handleReciterChange}
              />
            </div>
          </div>
        </div>
        
        <audio ref={audioRef} onEnded={onAudioEnded} onError={onAudioError} className="hidden" />

        <div className="p-6 space-y-8 font-body text-lg">
          {isLoading ? (
             <div className="space-y-8">
              <Skeleton className="h-12 w-1/2 mx-auto" />
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : selectedSurah ? (
            <>
              <h2 className="text-4xl font-arabic text-center font-bold text-primary" dir="rtl">
                {selectedSurah.name}
              </h2>
              {showBismillah && (
                <div className="p-4 rounded-lg text-center border-b border-dashed">
                   <p className="text-3xl leading-relaxed font-arabic" dir="rtl">
                     بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                   </p>
                   <p className="mt-4 text-muted-foreground text-base">
                     In the name of Allah, the Entirely Merciful, the Especially Merciful.
                   </p>
                 </div>
              )}
              {selectedSurah.verses.map((verse: Verse) => (
                <div 
                  key={verse.verse_key} 
                  ref={(el) => (verseRefs.current[verse.verse_key] = el)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${currentVerseKey === verse.verse_key ? 'bg-secondary' : 'hover:bg-muted/50'}`} 
                  onClick={() => handleVerseClick(verse)}
                >
                   <p className="text-3xl leading-relaxed text-right font-arabic" dir="rtl">
                    {verse.arabic} 
                    <span className="text-sm text-accent font-sans"> ({verse.id})</span>
                  </p>
                  <p className="mt-4 text-muted-foreground">{verse[translation]}</p>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-10">
              <p>Could not load surah content.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
