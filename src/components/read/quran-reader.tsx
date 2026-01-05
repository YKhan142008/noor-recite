
'use client';

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { allSurahs, reciters, activeTranslation } from '@/lib/data';
import quranPages from '@/lib/quran-pages.json';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Verse, Surah, Reciter, Bookmark as BookmarkType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Pause, Copy, Bookmark, ArrowLeft, ArrowRight, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { VerseTranslation } from './verse-translation';
import { useBookmarks } from '@/context/BookmarkContext';
import { useSurahProgress } from '@/context/SurahProgressContext';

function verseKeyToEveryAyahId(verseKey: string) {
  if (!verseKey) return '';
  const [surah, ayah] = verseKey.split(':');
  return `${surah.padStart(3, '0')}${ayah.padStart(3, '0')}`;
}

function getPageForVerse(surahId: number, verseNum: number): number {
    const pageInfo = quranPages.find(p => p.surah === surahId && verseNum >= p.from && verseNum <= p.to);
    return pageInfo ? pageInfo.page : 1;
}

type QuranReaderProps = {
  slug: string[];
  setCurrentPage: (page: number) => void;
}

export function QuranReader({ slug, setCurrentPage }: QuranReaderProps) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(reciters[0]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentVerseKey, setCurrentVerseKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const verseRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const readerContainerRef = useRef<HTMLDivElement | null>(null);

  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { progress, updateProgress } = useSurahProgress();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAyahJump = (verseKey: string) => {
    const verseElement = verseRefs.current[verseKey];
    if (verseElement) {
        const topPos = verseElement.getBoundingClientRect().top + window.pageYOffset;
        const offset = 150; // Offset for sticky header
        window.scrollTo({
            top: topPos - offset,
            behavior: 'auto'
        });
    }
  };

  const fetchSurahContent = async (surahId: string) => {
    setIsLoading(true);
    if (isPlaying) stopPlayback();

    try {
      const response = await fetch(`/api/quran?surah=${surahId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response from API.' }));
        throw new Error(errorData.message || 'Failed to fetch surah content');
      }

      const data = await response.json();
      
      if (!data.verses) {
        throw new Error('API did not return any verses.');
      }
      
      const surahInfo = allSurahs.find(s => s.id.toString() === surahId);
      if (!surahInfo) throw new Error('Surah not found in metadata');
      
      const newSelectedSurah = {
        id: surahInfo.id,
        name: surahInfo.name,
        englishName: surahInfo.englishName,
        verses: data.verses,
        total_verses: surahInfo.total_verses,
      };
      setSelectedSurah(newSelectedSurah);

      setCurrentVerseKey(null);
      
      const targetVerseNumStr = slug?.[1];
      if (targetVerseNumStr) {
        const targetVerseNum = parseInt(targetVerseNumStr, 10);
        const targetVerseKey = `${surahId}:${targetVerseNum}`;
        setCurrentPage(getPageForVerse(parseInt(surahId, 10), targetVerseNum));
        setTimeout(() => handleAyahJump(targetVerseKey), 100);
      } else {
        setCurrentPage(getPageForVerse(newSelectedSurah.id, 1));
        window.scrollTo(0, 0);
      }

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
    const surahIdFromUrl = slug?.[0] || '1';
    
    if (surahIdFromUrl !== selectedSurah?.id.toString()) {
      fetchSurahContent(surahIdFromUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);


  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
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
        audioRef.current.src = `/api/audio?url=${encodeURIComponent(audioUrl)}`;
        audioRef.current.load();
        audioRef.current.play().catch(e => {
            console.error("Audio play failed:", e);
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
    
    const verseElement = verseRefs.current[verseKey];
    if (verseElement) {
        handleAyahJump(verseKey);
    }
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
    if (!currentVerseKey || !selectedSurah) {
      stopPlayback();
      return;
    }
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
    const audio = audioRef.current;
    if (!audio) return;
    
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
  
  const handleSurahNavigate = (direction: 'next' | 'previous') => {
    const currentSurahId = selectedSurah?.id;
    if (currentSurahId === undefined) return;

    if (direction === 'next') {
      const nextId = currentSurahId === 114 ? 1 : currentSurahId + 1;
      router.push(`/read/${nextId}`);
    } else { // 'previous'
      const prevId = currentSurahId === 1 ? 114 : currentSurahId - 1;
      router.push(`/read/${prevId}`);
    }
  };

  const isBookmarked = (verseKey: string) => {
    return bookmarks.some(b => b.verse_key === verseKey);
  }

  const handleBookmarkToggle = (verse: Verse) => {
    if (!selectedSurah) return;
    if (isBookmarked(verse.verse_key)) {
      removeBookmark(verse.verse_key);
      toast({ title: 'Bookmark removed' });
    } else {
      const bookmark: BookmarkType = {
        surahId: selectedSurah.id,
        surahName: selectedSurah.name,
        verse_key: verse.verse_key,
        text: verse.arabic,
      };
      addBookmark(bookmark);
      toast({ title: 'Bookmark added' });
    }
  }

  const handleScroll = useCallback(() => {
    if (!selectedSurah) return;

    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 5;
    if (isAtBottom) {
      if (progress[selectedSurah.id] !== 100) {
        updateProgress(selectedSurah.id, 100);
      }
      const lastVerse = selectedSurah.verses[selectedSurah.verses.length - 1];
      const lastVerseNum = parseInt(lastVerse.verse_key.split(':')[1], 10);
      setCurrentPage(getPageForVerse(selectedSurah.id, lastVerseNum));
      return;
    }

    let topVerseKey = null;
    const offset = 160; 

    for (const verseKey in verseRefs.current) {
        const verseElement = verseRefs.current[verseKey];
        if (verseElement) {
            const rect = verseElement.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= offset) {
                topVerseKey = verseKey;
                break;
            }
        }
    }

    if (topVerseKey) {
        const [surahNumStr, verseNumStr] = topVerseKey.split(':');
        const verseNum = parseInt(verseNumStr, 10);
        const surahNum = parseInt(surahNumStr, 10);

        const totalVerses = selectedSurah.total_verses;
        const currentProgress = Math.round((verseNum / totalVerses) * 100);
        if (progress[selectedSurah.id] !== currentProgress) {
            updateProgress(selectedSurah.id, currentProgress);
        }
        
        const newPage = getPageForVerse(surahNum, verseNum);
        setCurrentPage(newPage);
    }
  }, [selectedSurah, progress, updateProgress, setCurrentPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleMarkAsComplete = (isComplete: boolean) => {
    if (selectedSurah) {
        updateProgress(selectedSurah.id, isComplete ? 100 : 0);
         if(isComplete) {
            toast({ title: `${selectedSurah.englishName} marked as complete!`});
        } else {
             toast({ title: `${selectedSurah.englishName} marked as incomplete.`});
        }
    }
  };

  const handleResetProgress = () => {
    if (selectedSurah) {
        updateProgress(selectedSurah.id, 0);
        toast({ title: `Progress for ${selectedSurah.englishName} has been reset.`});
    }
  }

  if (!isClient) {
    return (
      <Card className="overflow-hidden m-4 sm:m-6 lg:m-8">
        <CardContent className="p-6 space-y-8">
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isSurahComplete = selectedSurah ? progress[selectedSurah.id] === 100 : false;
  const showBismillah = selectedSurah && selectedSurah.id !== 1 && selectedSurah.id !== 9;

  return (
    <Card className="overflow-hidden shadow-none border-none rounded-none">
      <CardContent className="p-0">
        <audio ref={audioRef} onEnded={onAudioEnded} onError={onAudioError} className="hidden" />

        <div ref={readerContainerRef} className="p-6 md:p-8 lg:p-12 space-y-8 font-body text-lg">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <h2 className="text-5xl font-arabic text-center font-bold text-primary" dir="rtl">
                    {selectedSurah.name}
                  </h2>
                </div>
                <div className='flex flex-col md:flex-row gap-2 md:items-center md:justify-end'>
                    <div className='flex-1'>
                        <label className="text-sm font-medium mb-1 block">Reciter</label>
                        <Select value={selectedReciter.id} onValueChange={handleReciterChange}>
                            <SelectTrigger>
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
                    <div className='flex-1'>
                        <label className="text-sm font-medium mb-1 block opacity-0 hidden md:block">Action</label>
                        <Button variant="outline" className="w-full" onClick={handleResetProgress} disabled={!selectedSurah}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Read Again
                        </Button>
                    </div>
                </div>
              </div>

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
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleBookmarkToggle(verse)}>
                          <Bookmark className={cn("h-4 w-4", isBookmarked(verse.verse_key) ? 'fill-accent text-accent' : '')} />
                        </Button>
                    </div>
                     <div className="space-y-4">
                       <p className="text-3xl lg:text-4xl leading-relaxed text-right font-arabic" dir="rtl">
                        {verse.arabic}
                        {verse.verse_key && (
                          <>
                            <span className="text-xl mx-2 text-accent font-sans p-1 rounded-full border-2 border-accent w-8 h-8 inline-flex items-center justify-center">
                              {Number(verse.verse_key.split(':')[1]).toLocaleString('ar-SA')}
                            </span>
                            <span dangerouslySetInnerHTML={{ __html: '&lrm;' }} />
                          </>
                        )}
                      </p>
                      <VerseTranslation 
                        translation={verse.translation}
                        author={activeTranslation.author_name}
                        source={activeTranslation.name}
                      />
                     </div>
                  </div>
                </div>
              ))}
              </div>
              <div className="mt-12 pt-8 border-t space-y-4 text-center">
                 {isSurahComplete ? (
                    <Button onClick={() => handleMarkAsComplete(false)} variant="outline">
                      <XCircle className="mr-2" />
                      Un-mark as Complete
                    </Button>
                 ) : (
                    <Button onClick={() => handleMarkAsComplete(true)}>
                      <CheckCircle className="mr-2" />
                      Mark Surah as Complete
                    </Button>
                 )}
                <div className="flex justify-between items-center">
                    <Button 
                      onClick={() => handleSurahNavigate('previous')} 
                      variant="outline"
                    >
                      <ArrowLeft className="mr-2" />
                      Previous Surah
                    </Button>
                    <Button 
                      onClick={() => handleSurahNavigate('next')} 
                      variant="outline"
                    >
                      Next Surah
                      <ArrowRight className="ml-2" />
                    </Button>
                </div>
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
