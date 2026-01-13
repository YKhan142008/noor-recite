
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
      const [surah, verse] = verseKey.split(':');
      setIsLoading(true);
      setError(null);
      setTafsir(null);

      getTafsirByVerse(verseKey)
        .then((data) => {
          if (data) {
            // Adapt TafsirData to compatible format if needed or update Types
            setTafsir({
              surah: data.surah,
              verse: data.ayah,
              text: data.text
            } as any);
          } else {
            setError('Tafsir not found for this verse.');
          }
        })
        .catch((err) => {
          setError(err.message || 'An unknown error occurred.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [verseKey]);

  const isOpen = !!verseKey;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Tafsir Ibn Kathir for Verse {verseKey}
          </DialogTitle>
          <DialogDescription>
            Commentary and explanation for the selected verse.
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
            {error && <p className="text-destructive">{error}</p>}
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
