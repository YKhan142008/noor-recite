'use client';

import { BarChart3, Clock, BookOpen } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { ReadingChart } from '@/components/dashboard/reading-chart';
import { DailyAyah } from '@/components/dashboard/daily-ayah';
import { DailyHadith } from '@/components/dashboard/daily-hadith';
import { readingActivity, allSurahs } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useSurahProgress } from '@/context/SurahProgressContext';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { progress } = useSurahProgress();

  const { versesRead, completionPercentage } = useMemo(() => {
    let totalVersesRead = 0;
    const TOTAL_VERSES = 6236; // Standard count

    allSurahs.forEach(surah => {
      const surahProgress = progress[surah.id] || 0;
      if (surahProgress > 0) {
        // Calculate estimate verses read for this surah
        // Math.floor to be conservative
        totalVersesRead += Math.floor((surahProgress / 100) * surah.total_verses);
      }
    });

    return {
      versesRead: totalVersesRead,
      completionPercentage: (totalVersesRead / TOTAL_VERSES) * 100
    };
  }, [progress]);

  const stats = {
    versesRead: {
      title: "Verses Read",
      value: versesRead.toLocaleString(),
      change: "Estimated Total", // More accurate label
      changeType: "increase" as const
    },
    timeSpent: {
      title: "Quran Completed",
      value: `${completionPercentage.toFixed(1)}%`,
      change: "Global Progress",
      changeType: "increase" as const
    },
    readingStreak: {
      title: "Current Streak",
      value: versesRead > 0 ? "1 Day" : "0 Days",
      change: versesRead > 0 ? "Keep it up!" : "Start today!",
      changeType: versesRead > 0 ? "increase" : "neutral" as const
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">
          Assalamu 'alaikum{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-muted-foreground">"The best of you are those who learn the Qur'an and teach it." - Prophet Muhammad (ﷺ)</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard icon={<BookOpen />} {...stats.versesRead} />
        <StatCard icon={<Clock />} {...stats.timeSpent} />
        <StatCard icon={<BarChart3 />} {...stats.readingStreak} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Reading Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ReadingChart data={readingActivity} />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <DailyAyah />
          <DailyHadith />
        </div>
      </div>
    </div>
  );
}
