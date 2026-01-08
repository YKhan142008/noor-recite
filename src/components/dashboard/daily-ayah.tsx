
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { dailyAyah } from '@/lib/data';

export function DailyAyah() {
  const [surahNum, verseNum] = dailyAyah.verse_key.split(':');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Star className="text-accent" />
          Ayah of the Day
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-arabic text-right leading-relaxed" dir="rtl">
          {dailyAyah.arabic}
        </p>
        <p className="text-sm text-muted-foreground italic">
          "{dailyAyah.translation}"
        </p>
        <p className="text-sm font-semibold text-primary">
          Surah Az-Zumar ({dailyAyah.verse_key})
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/read/${surahNum}/${verseNum}`}>
            <BookOpen />
            Read in Context
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
