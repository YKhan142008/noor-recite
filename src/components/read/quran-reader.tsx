
'use client';

import { useState, useEffect, useRef } from 'react';
import { allSurahs as surahs, reciters, translations } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Verse, Surah, Reciter, Translation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Pause, Copy, Bookmark } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { VerseTranslation } from './verse-translation';

function verseKeyToEveryAyahId(verseKey: string) {
  if (!verseKey) return '';
  const [surah, ayah] = verseKey.split(':');
  return `${surah.padStart(3, '0')}${ayah.padStart(3, '0')}`;
}

const englishTranslations = translations.filter(t => t.language === 'english');
const urduTranslations = translations.filter(t => t.language === 'urdu');

export function QuranReader() {
  const [isClient, setIsClient] = useState(false);
  const [selectedSurahId, setSelectedSurahId] = useState<string>('1');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedTranslationId, setSelectedTranslationId] = useState<string>('85'); // Default to Hilali & Khan
  
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

  const fetchSurahContent = async (surahId: string, translationId: string) => {
    setIsLoading(true);
    if (isPlaying) stopPlayback();

    try {
      const response = await fetch(`/api/quran?surah=${surahId}&translations=${translationId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response from API.' }));
        throw new Error(errorData.message || 'Failed to fetch surah content');
      }

      const data = await response.json();
      
      if (!data.verses) {
        throw new Error('API did not return any verses.');
      }
      
      const surahInfo = surahs.find(s => s.id.toString() === surahId);
      if (!surahInfo) throw new Error('Surah not found in metadata');
      
      setSelectedSurah({
        ...surahInfo,
        verses: data.verses,
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
    if (selectedSurahId && selectedTranslationId) {
      fetchSurahContent(selectedSurahId, selectedTranslationId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSurahId, selectedTranslationId]);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      // More robust way to stop loading, prevents erroneous error events
      audioRef.current.removeAttribute('src'); 
      audioRef.current.load();
    }
    setIsPlaying(false);
    setCurrentVerseKey(null);
  };
  
  const playVerse = (verseKey: string) => {
    if (!selectedSurah) return;
    const verse = selectedSurah.verses.find(v => v.verse_key === verseKey);
    if (!verse) return;

    const fileId = verseKeyToEveryAyahId(verseKey);
    const audioUrl = `https://verses.quran.com/${selectedReciter.audio_url_path}/${fileId}.mp3`;
    
    if (audioRef.current) {
        // Use the audio proxy to avoid CORS issues
        audioRef.current.src = `/api/audio?url=${encodeURIComponent(audioUrl)}`;
        audioRef.current.load();
        audioRef.current.play().catch(e => {
            console.error("Audio play failed:", e);
            // This error is for when playback can't *start*
            if (isPlaying) {
                 toast({
                    variant: "destructive",
                    title: "Audio Playback Error",
                    description: "Could not play the requested audio file.",
                });
                setIsPlaying(false);
            }
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
        // Start playing from the first verse if nothing is playing
        const firstVerseKey = selectedSurah.verses[0]?.verse_key;
        if (firstVerseKey) playVerse(firstVerseKey);
      }
    }
  };

  const playNextVerse = () => {
    if (!currentVerseKey || !selectedSurah) {
      stopPlayback();
      return;
    }
    const currentIndex = selectedSurah.verses.findIndex(v => v.verse_key === currentVerseKey);
    if (currentIndex > -1 && currentIndex < selectedSurah.verses.length - 1) {
      const nextVerseKey = selectedSurah.verses[currentIndex + 1].verse_key;
      playVerse(nextVerseKey);
    } else {
      // Reached the end of the surah
      stopPlayback();
    }
  };
  
  const handleVerseClick = (verse: Verse) => {
    if (currentVerseKey === verse.verse_key && isPlaying) {
      handlePlayPause(); // This will pause it
    } else {
      playVerse(verse.verse_key);
    }
  };
  
  const onAudioEnded = () => {
    playNextVerse();
  };

  const onAudioError = (e: any) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Ignore errors caused by stopping/clearing the source intentionally
    const error = audio.error;
    if (!audio.currentSrc || (error && error.code === MediaError.MEDIA_ERR_ABORTED)) {
        return;
    }

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

  const getSelectedTranslationMeta = () => {
    return translations.find(t => t.id === selectedTranslationId);
  }

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
                <Select value={selectedTranslationId} onValueChange={setSelectedTranslationId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Translation" />
                  </SelectTrigger>
                  <SelectContent>
                        <p className="px-3 py-2 text-sm font-semibold text-muted-foreground">English</p>
                        {englishTranslations.map((translation) => (
                          <SelectItem key={translation.id} value={translation.id}>
                            {translation.name}
                          </SelectItem>
                        ))}
                         <p className="px-3 py-2 text-sm font-semibold text-muted-foreground">Urdu</p>
                        {urduTranslations.map((translation) => (
                          <SelectItem key={translation.id} value={translation.id}>
                            {translation.name}
                          </SelectItem>
                        ))}
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
              <h2 className="text-5xl font-arabic text-center font-bold text-primary mb-12 mt-8" dir="rtl">
                <Skeleton className="h-16 w-1/2 mx-auto" />
              </h2>
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          ) : selectedSurah ? (
            <>
              <h2 className="text-5xl font-arabic text-center font-bold text-primary mb-12 mt-8" dir="rtl">
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
                    {selectedTranslationId && (
                       <p className="mt-4 text-muted-foreground text-base">
                        In the name of Allah, the Entirely Merciful, the Especially Merciful.
                       </p>
                    )}
                 </div>
              )}
              <div className='space-y-10'>
              {selectedSurah.verses.map((verse: Verse) => (
                <div 
                  key={verse.verse_key} 
                  ref={(el) => (verseRefs.current[verse.verse_key] = el)}
                  className={cn(
                      'p-4 rounded-lg transition-colors',
                      currentVerseKey === verse.verse_key ? 'bg-secondary' : ''
                  )}
                >
                  <div className='grid grid-cols-[auto,1fr] gap-x-4 md:gap-x-8'>
                    <div className='flex flex-col items-center space-y-4 text-sm text-muted-foreground'>
                        <span>{verse.verse_key}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleVerseClick(verse)}>
                          {currentVerseKey === verse.verse_key && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => verse.translation && navigator.clipboard.writeText(verse.arabic + '\n' + verse.translation)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                    </div>
                     <div className="space-y-4">
                       <p className="text-3xl lg:text-4xl leading-relaxed text-right font-arabic" dir="rtl">
                        {verse.arabic}
                        {verse.verse_key && (
                          <span className="text-xl mx-2 text-accent font-sans p-1 rounded-full border-2 border-accent w-8 h-8 inline-flex items-center justify-center">
                            {Number(verse.verse_key.split(':')[1]).toLocaleString('ar-SA')}
                          </span>
                        )}
                      </p>
                      <VerseTranslation 
                        translation={verse.translation}
                        author={getSelectedTranslationMeta()?.author_name}
                        source={getSelectedTranslationMeta()?.name}
                      />
                     </div>
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
