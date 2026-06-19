import React, { useMemo, useState } from 'react';
import { Activity, Footprints, Flame, Droplet, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData } from '../lib/apiHelpers';
import { fallbackAnalyticsMetrics, normalizeAnalyticsMetrics } from '../lib/healthData';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PageShell } from '../components/ui/PageShell';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeader } from '../components/ui/SectionHeader';

const weeklyBars = [
  { day: 'Mon', value: 62 },
  { day: 'Tue', value: 71 },
  { day: 'Wed', value: 58 },
  { day: 'Thu', value: 84 },
  { day: 'Fri', value: 76 },
  { day: 'Sat', value: 92 },
  { day: 'Sun', value: 68 },
];

export const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');
  const { data: analyticsResponse } = useQuery({
    queryKey: ['web-analytics'],
    queryFn: () => api.getDashboardStats().catch(() => null),
  });

  const metrics = useMemo(() => normalizeAnalyticsMetrics(unwrapData<any[]>(analyticsResponse)), [analyticsResponse]);
  const average = Math.round(metrics.reduce((sum, metric) => sum + Number(metric.value.replace(/,/g, '')) || 0, 0) / metrics.length);

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Performance analytics"
        title="Insights That Improve Wins"
        description="See where your health habits are improving and which competitions benefit most from your consistency."
        action={
          <div className="flex gap-2">
            {(['7d', '30d'] as const).map((item) => (
              <button key={item} className={`btn-mobile ${period === item ? 'bg-primary text-primary-foreground' : 'btn-secondary'}`} onClick={() => setPeriod(item)}>
                {item}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={metric.label}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
              <Badge variant={metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'warning' : 'locked'}>{metric.delta}</Badge>
            </div>
            <div className="mt-4 text-3xl font-bold tabular">{metric.value}</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              {metric.trend === 'up' ? <TrendingUp size={16} /> : metric.trend === 'down' ? <TrendingDown size={16} /> : <Minus size={16} />}
              <span>Compared with previous {period}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Activity Consistency</h2>
              <p className="text-sm text-muted-foreground">Daily score across the selected period.</p>
            </div>
            <Badge variant="primary">Avg {average}</Badge>
          </div>
          <div className="flex h-64 items-end gap-3">
            {weeklyBars.map((bar) => (
              <div key={bar.day} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div className="w-full max-w-10 rounded-t-xl bg-muted">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-primary to-accent" style={{ height: `${bar.value}px` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{bar.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="text-lg font-semibold">Health Mix</h2>
            <div className="mt-5 space-y-5">
              <HealthRow icon={<Footprints size={18} />} label="Steps" value={86} />
              <HealthRow icon={<Droplet size={18} />} label="Hydration" value={72} />
              <HealthRow icon={<Flame size={18} />} label="Calories" value={64} />
              <HealthRow icon={<Trophy size={18} />} label="Competition Score" value={78} />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Coach Note</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your cardio consistency is strong. Add one recovery session per week to protect your streak and keep competition performance stable.
            </p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
};

function HealthRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
          {label}
        </div>
        <span className="text-sm font-semibold tabular">{value}%</span>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}
