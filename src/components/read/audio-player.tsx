'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { reciters } from '@/lib/data';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

type AudioPlayerProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export function AudioPlayer({ isPlaying, onPlayPause, onNext, onPrev }: AudioPlayerProps) {
  const [selectedReciterId, setSelectedReciterId] = useState(reciters[0].id);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-lg bg-card p-4 border">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onPrev}>
                <SkipBack className="h-5 w-5" />
                <span className="sr-only">Previous Verse</span>
            </Button>
            <Button variant="ghost" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90 w-12 h-12" onClick={onPlayPause}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onNext}>
                <SkipForward className="h-5 w-5" />
                <span className="sr-only">Next Verse</span>
            </Button>
        </div>
        <div className='w-full md:w-auto'>
          <Select value={selectedReciterId} onValueChange={setSelectedReciterId}>
            <SelectTrigger className="w-full md:w-[200px]">
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
  );
}
