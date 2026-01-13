import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
};

export function StatCard({ icon, title, value, change, changeType }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-headline">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={cn(
            'text-xs text-muted-foreground',
            changeType === 'increase' ? 'text-green-600' :
              changeType === 'decrease' ? 'text-red-600' : 'text-muted-foreground'
          )}
        >
          {change}
        </p>
      </CardContent>
    </Card>
  );
}
