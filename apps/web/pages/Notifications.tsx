import React, { useMemo, useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { BellRing, CheckCheck, Trophy, Users, Gift, AlertCircle, Activity } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData } from '../lib/apiHelpers';
import { fallbackNotifications, normalizeNotifications } from '../lib/healthData';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageShell } from '../components/ui/PageShell';
import { SectionHeader } from '../components/ui/SectionHeader';

const motion = motionBase as any;

const iconMap: Record<string, React.ReactNode> = {
  rank: <Activity className="h-4 w-4" />,
  competition: <Trophy className="h-4 w-4" />,
  friend: <Users className="h-4 w-4" />,
  reward: <Gift className="h-4 w-4" />,
  system: <AlertCircle className="h-4 w-4" />,
};

export const Notifications: React.FC = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');
  const { data: notificationResponse } = useQuery({
    queryKey: ['web-notifications'],
    queryFn: () => api.getNotifications().catch(() => null),
  });

  const notifications = useMemo(() => normalizeNotifications(unwrapData<any[]>(notificationResponse)), [notificationResponse]);
  const filteredNotifications = filter === 'All' ? notifications : notifications.filter((notification) => !notification.read);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.markNotificationRead(id).catch(() => null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web-notifications'] });
    },
  });

  const markAllRead = () => {
    notifications.filter((notification) => !notification.read).forEach((notification) => markReadMutation.mutate(notification.id));
  };

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Notification center"
        title="Stay In The Loop"
        description="Rank moves, friend activity, reward milestones, and battle reminders in one place."
        action={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setFilter((current) => current === 'All' ? 'Unread' : 'All')}>
              {filter}
            </Button>
            <Button disabled={unreadCount === 0} onClick={markAllRead}>
              <CheckCheck size={18} /> Mark All Read
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard label="Total" value={notifications.length} />
        <SummaryCard label="Unread" value={unreadCount} highlight />
        <SummaryCard label="Battle Alerts" value={notifications.filter((item) => item.type === 'competition').length} />
        <SummaryCard label="Rank Moves" value={notifications.filter((item) => item.type === 'rank').length} />
      </div>

      <div className="space-y-3">
        {filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            className={`card-mobile ${notification.read ? 'opacity-80' : 'border-primary/30 bg-primary/5'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${notification.read ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                {iconMap[notification.type] || iconMap.system}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{notification.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={notification.read ? 'locked' : 'live'}>{notification.read ? 'Read' : 'New'}</Badge>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
                {notification.actionLabel && (
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Button size="sm">{notification.actionLabel}</Button>
                    {!notification.read && <button className="btn-ghost text-xs" onClick={() => markReadMutation.mutate(notification.id)}>Mark read</button>}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {filteredNotifications.length === 0 && (
          <Card>
            <div className="flex items-center gap-3 text-muted-foreground">
              <BellRing size={20} />
              <p>No notifications match this filter.</p>
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  );
};

function SummaryCard({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <Card className={highlight ? 'border-primary/30 bg-primary/5' : ''}>
      <div className="text-3xl font-bold tabular">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </Card>
  );
}
