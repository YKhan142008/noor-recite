
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

      fetch(`/api/tafsir?surah=${surah}&verse=${verse}`)
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch tafsir');
          }
          return res.json();
        })
        .then((data: Tafsir) => {
          setTafsir(data);
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
              <p className="text-base leading-relaxed whitespace-pre-wrap font-body">
                {tafsir.text}
              </p>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
