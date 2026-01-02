
'use client';

import type { ReadingActivity } from '@/lib/types';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

type ReadingChartProps = {
  data: ReadingActivity[];
};

const chartConfig = {
  minutes: {
    label: "Minutes",
  },
} satisfies ChartConfig

export function ReadingChart({ data }: ReadingChartProps) {
  return (
    <div className="h-[250px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer>
          <BarChart data={data} accessibilityLayer>
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}m`}
            />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--secondary))', radius: 'var(--radius)' }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="minutes"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
