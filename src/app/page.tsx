import { BarChart3, Medal, Clock, BookOpen } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { ReadingChart } from '@/components/dashboard/reading-chart';
import { AchievementsGrid } from '@/components/dashboard/achievements-grid';
import { readingStats, readingActivity, achievements } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">Assalamu 'alaikum!</h1>
        <p className="text-muted-foreground">"The best of you are those who learn the Qur'an and teach it." - Prophet Muhammad (ﷺ)</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard icon={<BookOpen />} {...readingStats.versesRead} />
        <StatCard icon={<Clock />} {...readingStats.timeSpent} />
        <StatCard icon={<BarChart3 />} {...readingStats.readingStreak} />
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
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Medal className="text-accent" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AchievementsGrid achievements={achievements} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
