
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookHeart } from 'lucide-react';
import { dailyHadith } from '@/lib/data';

export function DailyHadith() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BookHeart className="text-accent" />
          Hadith of the Day
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground italic">
          {dailyHadith.text}
        </p>
        <p className="text-sm font-semibold text-primary">
          {dailyHadith.source}
        </p>
      </CardContent>
    </Card>
  );
}
