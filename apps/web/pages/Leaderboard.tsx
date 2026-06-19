import React, { useMemo, useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { Trophy, Users, TrendingUp, TrendingDown, Minus, Medal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData } from '../lib/apiHelpers';
import { fallbackLeaderboardEntries, normalizeLeaderboard } from '../lib/healthData';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PageShell } from '../components/ui/PageShell';
import { SectionHeader } from '../components/ui/SectionHeader';

const motion = motionBase as any;

type Scope = 'global' | 'friends' | 'team';

export const Leaderboard: React.FC = () => {
  const [scope, setScope] = useState<Scope>('global');
  const { data: leaderboardResponse } = useQuery({
    queryKey: ['web-leaderboard', scope],
    queryFn: () => api.getLeaderboard(scope).catch(() => null),
  });

  const entries = useMemo(() => normalizeLeaderboard(unwrapData<any[]>(leaderboardResponse)), [leaderboardResponse]);

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Live rankings"
        title="Leaderboard"
        description="Track your position across global athletes, friends, and team battles."
        action={
          <div className="flex flex-wrap gap-2">
            {(['global', 'friends', 'team'] as const).map((item) => (
              <button key={item} className={`btn-mobile capitalize ${scope === item ? 'bg-primary text-primary-foreground' : 'btn-secondary'}`} onClick={() => setScope(item)}>
                {item}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <RankSummary label="Best Rank" value="#5" />
        <RankSummary label="Rank Change" value="+18" positive />
        <RankSummary label="Score Gap" value="910 pts" />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-[0.8fr_1.6fr_1fr_0.8fr] gap-4 border-b border-border bg-muted/50 p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Rank</span>
          <span>Athlete</span>
          <span>Score</span>
          <span>Movement</span>
        </div>
        <div className="divide-y divide-border">
          {entries.map((entry, index) => (
            <motion.div key={entry.id} className="grid grid-cols-[0.8fr_1.6fr_1fr_0.8fr] items-center gap-4 p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${entry.rank <= 3 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {entry.rank <= 3 ? <Medal size={18} /> : entry.rank}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Trophy size={18} />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">{entry.name}</div>
                  <div className="text-xs text-muted-foreground">@{entry.username}</div>
                </div>
              </div>
              <div className="text-sm font-semibold tabular">{entry.score.toLocaleString()}</div>
              <div>
                <Badge variant={entry.movement === 'up' ? 'success' : entry.movement === 'down' ? 'warning' : 'locked'}>
                  <span className="flex items-center gap-1">
                    {entry.movement === 'up' ? <TrendingUp size={14} /> : entry.movement === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
                    {entry.movement}
                  </span>
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </PageShell>
  );
};

function RankSummary({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Users size={18} className="text-muted-foreground" />
      </div>
      <div className={`mt-3 text-3xl font-bold tabular ${positive ? 'text-success' : 'text-foreground'}`}>{value}</div>
    </Card>
  );
}
