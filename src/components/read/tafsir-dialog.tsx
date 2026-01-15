
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import type { Tafsir } from '@/lib/types';
import { getTafsirByVerse } from '@/lib/tafsir-service';

type TafsirDialogProps = {
  verseKey: string | null;
  onOpenChange: (open: boolean) => void;
};

export function TafsirDialog({ verseKey, onOpenChange }: TafsirDialogProps) {
  const [tafsir, setTafsir] = useState<Tafsir | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (verseKey) {
      setIsLoading(true);
      setError(null);
      setTafsir(null);

      getTafsirByVerse(verseKey)
        .then((data) => {
          if (data) {
            setTafsir({
              id: 0,
              surah: data.surah,
              verse: data.ayah,
              text: data.text,
              ayah_keys: data.ayah_keys
            });
          } else {
            setError('could not find tafsir');
          }
        })
        .catch((err) => {
          setError('could not find tafsir');
          console.error('Tafsir fetch error:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [verseKey]);

  const isOpen = !!verseKey;

  const displayTitle = tafsir?.ayah_keys && tafsir.ayah_keys.length > 1
    ? `Tafsir Ibn Kathir for Verses ${tafsir.ayah_keys[0]} - ${tafsir.ayah_keys[tafsir.ayah_keys.length - 1]}`
    : `Tafsir Ibn Kathir for Verse ${verseKey}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onOpenChange(false);
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isLoading ? 'Loading Tafsir...' : displayTitle}
          </DialogTitle>
          <DialogDescription>
            Commentary and explanation for the selected {tafsir?.ayah_keys && tafsir.ayah_keys.length > 1 ? 'verses' : 'verse'}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ScrollArea className="h-96 pr-6">
            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                <div className="text-destructive font-medium text-lg mb-2">{error}</div>
                <p className="text-muted-foreground">The requested commentary is currently unavailable.</p>
              </div>
            )}
            {tafsir && (
              <div
                className="text-base leading-relaxed font-body [&>p]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-2"
                dangerouslySetInnerHTML={{ __html: tafsir.text }}
              />
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
