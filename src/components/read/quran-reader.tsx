
'use client';

import { useState, useEffect, useRef } from 'react';
import { allSurahs as surahs, reciters } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Verse, Surah, Reciter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Pause, Copy, Bookmark } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

function verseKeyToEveryAyahId(verseKey: string) {
  if (!verseKey) return '';
  const [surah, ayah] = verseKey.split(':');
  return `${surah.padStart(3, '0')}${ayah.padStart(3, '0')}`;
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
    setCurrentVerseKey(null);
  };
  
  const playVerse = (verseKey: string) => {
    const verse = selectedSurah?.verses.find(v => v.verse_key === verseKey);
    if (!verse) return;

    const fileId = verseKeyToEveryAyahId(verseKey);
    const audioUrl = `https://verses.quran.com/${selectedReciter.audio_url_path}/${fileId}.mp3`;
    
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
        audioRef.current?.play().catch(e => console.error("Audio resume failed:", e));
        setIsPlaying(true);
      } else if (selectedSurah?.verses.length) {
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
  
  const handleVerseClick = (verse: Verse) => {
    if (currentVerseKey === verse.verse_key && isPlaying) {
      handlePlayPause(); 
    } else {
      playVerse(verse.verse_key);
    }
  };
  
  const onAudioEnded = () => {
    playNextVerse();
  };

  const onAudioError = (e: any) => {
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
              <Skeleton className="h-10 w-full" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
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
             <div>
              <label className="text-sm font-medium mb-1 block">Reciter</label>
              <Select value={selectedReciter.id} onValueChange={handleReciterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Reciter" />
                </SelectTrigger>
                <SelectContent>
                  {reciters.map((reciter) => (
                    <SelectItem key={reciter.id} value={reciter.id}>
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <audio ref={audioRef} onEnded={onAudioEnded} onError={onAudioError} className="hidden" />

        <div className="p-6 md:p-8 lg:p-12 space-y-8 font-body text-lg">
          {isLoading ? (
             <div className="space-y-8">
              <Skeleton className="h-16 w-1/2 mx-auto" />
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          ) : selectedSurah ? (
            <>
              <h2 className="text-5xl font-arabic text-center font-bold text-primary mb-4 mt-2" dir="rtl">
                {selectedSurah.name}
              </h2>
              <div className='text-center mb-8'>
                <Button variant="ghost" onClick={handlePlayPause}>
                  {isPlaying ? <Pause className='mr-2' /> : <Play className='mr-2' />}
                  {isPlaying ? 'Pause' : 'Play Audio'}
                </Button>
              </div>

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
              <div className='space-y-10'>
              {selectedSurah.verses.map((verse: Verse) => (
                <div 
                  key={verse.verse_key} 
                  ref={(el) => (verseRefs.current[verse.verse_key] = el)}
                  className={cn(
                      'grid grid-cols-12 gap-x-4 md:gap-x-8 p-4 rounded-lg transition-colors',
                      currentVerseKey === verse.verse_key ? 'bg-secondary' : ''
                  )}
                >
                  <div className='col-span-1 flex flex-col items-center space-y-4 text-sm text-muted-foreground'>
                      <span>{verse.verse_key}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleVerseClick(verse)}>
                        {currentVerseKey === verse.verse_key && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigator.clipboard.writeText(verse.arabic + '\n' + verse[translation])}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                  </div>
                   <div className="col-span-11 space-y-4">
                     <p className="text-3xl lg:text-4xl leading-relaxed text-right font-arabic" dir="rtl">
                      {verse.arabic} 
                      <span className="text-xl mx-2 text-accent font-sans p-1 rounded-full border-2 border-accent w-8 h-8 inline-flex items-center justify-center">
                        {verse.id.toLocaleString('ar-SA')}
                      </span>
                    </p>
                    <p className="mt-4 text-foreground/80 leading-relaxed">{verse[translation]}</p>
                   </div>
                </div>
              ))}
              </div>
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
