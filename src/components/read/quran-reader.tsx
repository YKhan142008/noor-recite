
'use client';

import { useState, useEffect, useRef } from 'react';
import { surahs, reciters } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioPlayer } from './audio-player';
import type { Verse, Surah } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function QuranReader() {
  const [allSurahs, setAllSurahs] = useState<Surah[]>(surahs);
  const [isClient, setIsClient] = useState(false);
  const [selectedSurahId, setSelectedSurahId] = useState<string>('1');
  const [selectedSurahContent, setSelectedSurahContent] = useState<Surah | null>(null);
  const [translation, setTranslation] = useState<'english' | 'indonesian'>('english');
  const [selectedReciterId, setSelectedReciterId] = useState<string>(reciters[0].id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentVerseId, setCurrentVerseId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentVerseId(null);
    if (audioRef.current) {
      audioRef.current.pause();
      // Setting src to '' can cause an error event, so we avoid it.
      // We'll just set a new src when play is clicked again.
    }
  };

  const fetchSurahContent = async (surahId: string) => {
    setIsLoading(true);
    stopPlayback();
    try {
      const response = await fetch(`/api/quran?surah=${surahId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch surah content');
      }
      const data = await response.json();
      
      const surahInfo = allSurahs.find(s => s.id.toString() === surahId);
      if (!surahInfo) throw new Error('Surah not found in metadata');

      let fetchedVerses: Verse[] = data.verses.map((v: any, index: number) => ({
        id: index + 1, // Ensure verse IDs are sequential starting from 1
        arabic: v.text_uthmani,
        english: data.translations[index]?.text || '',
        indonesian: data.indonesianTranslations[index]?.text || '',
        verse_key: v.verse_key
      }));
      
      if (surahInfo.id !== 1 && surahInfo.id !== 9) {
        fetchedVerses.unshift({
          id: 0,
          arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
          indonesian: 'Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.',
          verse_key: '1:1'
        });
      }

      setSelectedSurahContent({
        ...surahInfo,
        verses: fetchedVerses,
      });

    } catch (error) {
      console.error("Error fetching surah content:", error);
      toast({
        variant: 'destructive',
        title: 'Failed to load Surah',
        description: 'Could not retrieve the content for this surah. Please try again.',
      });
      setSelectedSurahContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurahContent(selectedSurahId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSurahId]);


  const getVerseKeyForAudio = (verse: Verse) => {
    if (!verse.verse_key) return null;
    if (verse.id === 0) {
      // The Bismillah verse for all surahs (except 1 and 9) should use the audio for 1:1
      return '001001';
    }
    const [surah, ayah] = verse.verse_key.split(':');
    return `${surah.padStart(3, '0')}${ayah.padStart(3, '0')}`;
  }

  const playVerse = async (verse: Verse) => {
    const selectedReciter = reciters.find(r => r.id === selectedReciterId);
    if (!selectedReciter || !selectedSurahContent) return;

    const verseKey = getVerseKeyForAudio(verse);
    if (!verseKey) {
      console.error("Could not determine verse key for audio.", verse);
      toast({
          variant: "destructive",
          title: "Audio Playback Error",
          description: "Could not determine the correct audio file for this verse.",
      });
      return;
    }

    const newAudioUrl = `https://everyayah.com/data/${selectedReciter.audio_url_path}/${verseKey}.mp3`;
    
    setAudioUrl(`/api/audio?url=${encodeURIComponent(newAudioUrl)}`);
    setCurrentVerseId(verse.id);
    setIsPlaying(true);
  };
  
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load(); // Load the new source
      audioRef.current.play().catch(e => {
        console.error("Audio play failed on source change:", e);
        stopPlayback();
        toast({
          variant: "destructive",
          title: "Audio Playback Error",
          description: "There was an issue starting audio playback.",
        });
      });
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    } else {
      if (currentVerseId !== null && audioRef.current && audioRef.current.src) {
        setIsPlaying(true);
        audioRef.current.play().catch(e => console.error("Audio play failed on resume:", e));
      } else if (selectedSurahContent?.verses.length) {
        // If nothing is playing, play the first verse
        playVerse(selectedSurahContent.verses[0]);
      }
    }
  };

  const playNextVerse = () => {
    if (currentVerseId === null || !selectedSurahContent) return;
    const currentVerseIndex = selectedSurahContent.verses.findIndex(v => v.id === currentVerseId);
    const nextVerse = selectedSurahContent.verses[currentVerseIndex + 1];
    if (nextVerse) {
      playVerse(nextVerse);
    } else {
      stopPlayback();
    }
  };
  
  const playPrevVerse = () => {
    if (currentVerseId === null || !selectedSurahContent) return;
    const currentVerseIndex = selectedSurahContent.verses.findIndex(v => v.id === currentVerseId);
    if (currentVerseIndex > 0) {
      const prevVerse = selectedSurahContent.verses[currentVerseIndex - 1];
      playVerse(prevVerse);
    }
  };

  const handleVerseClick = (verse: Verse) => {
    if (currentVerseId === verse.id && isPlaying) {
      setIsPlaying(false);
       if (audioRef.current) audioRef.current.pause();
    } else {
      playVerse(verse);
    }
  };
  
  const onAudioEnded = () => {
    playNextVerse();
  };

  const onAudioError = (e: any) => {
    console.error(`Audio Error: Failed to load source ${audioUrl}`, {error: e});
    toast({
      variant: "destructive",
      title: "Audio Playback Error",
      description: "Could not play the requested audio file. The reciter may not have a recording for this verse.",
    })
    stopPlayback();
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
                  {allSurahs.map((surah) => (
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
                onReciterChange={(id) => {
                  stopPlayback();
                  setSelectedReciterId(id);
                }}
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
          ) : selectedSurahContent ? (
            <>
              <h2 className="text-4xl font-arabic text-center font-bold text-primary" dir="rtl">
                {selectedSurahContent.name}
              </h2>
              {selectedSurahContent.verses.map((verse: Verse) => (
                <div key={verse.id} className={`p-4 rounded-lg cursor-pointer transition-colors ${currentVerseId === verse.id ? 'bg-secondary' : 'hover:bg-muted/50'}`} onClick={() => handleVerseClick(verse)}>
                   <p className="text-3xl leading-relaxed text-right font-arabic" dir="rtl">
                    {verse.arabic} 
                    {verse.id > 0 && <span className="text-sm text-accent font-sans"> ({verse.id})</span>}
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
