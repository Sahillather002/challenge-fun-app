import React, { useMemo, useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { Search, UserPlus, Users, Trophy, MessageCircle, BellRing, Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData } from '../lib/apiHelpers';
import { fallbackFriendRequests, fallbackFriends, normalizeFriends, type FriendItem } from '../lib/healthData';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageShell } from '../components/ui/PageShell';
import { SectionHeader } from '../components/ui/SectionHeader';

const motion = motionBase as any;

const statusLabel: Record<FriendItem['status'], string> = {
  online: 'Online',
  offline: 'Offline',
  'in-battle': 'In battle',
};

export const Friends: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState(fallbackFriendRequests);
  const { data: friendsResponse } = useQuery({
    queryKey: ['web-friends'],
    queryFn: () => api.getFriends().catch(() => null),
  });

  const friends = useMemo(() => normalizeFriends(unwrapData<any[]>(friendsResponse)), [friendsResponse]);
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequest = (id: string, accepted: boolean) => {
    setRequests((current) => current.filter((request) => request.id !== id));
  };

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Social arena"
        title="Friends & Challenges"
        description="Follow athletes, challenge friends, and build rivalries that keep you consistent."
        action={<Button><UserPlus size={18} /> Invite Friends</Button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input className="input-mobile pl-11" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search friends by name or username..." />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredFriends.map((friend, index) => (
              <motion.div key={friend.id} className="card-mobile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {friend.avatar ? <img src={friend.avatar} alt={friend.name} className="h-full w-full rounded-full object-cover" /> : <Users size={20} />}
                    </div>
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${friend.status === 'online' || friend.status === 'in-battle' ? 'bg-success' : 'bg-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{friend.name}</h3>
                        <p className="text-sm text-muted-foreground">@{friend.username}</p>
                      </div>
                      <Badge variant={friend.status === 'in-battle' ? 'live' : friend.status === 'online' ? 'success' : 'locked'}>{statusLabel[friend.status]}</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-3">
                      <MiniStat label="Rank" value={`#${friend.rank}`} />
                      <MiniStat label="Active" value={friend.lastActive} />
                      <MiniStat label="Shared" value={`${friend.mutualCompetitions}`} />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="flex-1"><MessageCircle size={16} /> Message</Button>
                      <Button size="sm" variant="ghost" className="flex-1"><Trophy size={16} /> Challenge</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BellRing size={20} /></div>
                <div>
                  <h2 className="text-lg font-semibold">Friend Requests</h2>
                  <p className="text-sm text-muted-foreground">{requests.length} pending</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="rounded-xl border border-border bg-muted/40 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {request.avatar ? <img src={request.avatar} alt={request.name} className="h-full w-full rounded-full object-cover" /> : <UserPlus size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-foreground">{request.name}</h3>
                      <p className="truncate text-xs text-muted-foreground">@{request.username}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{request.reason}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="btn-primary flex-1" onClick={() => handleRequest(request.id, true)}><Check size={16} /> Accept</button>
                    <button className="btn-secondary flex-1" onClick={() => handleRequest(request.id, false)}><X size={16} /> Pass</button>
                  </div>
                </div>
              ))}
              {requests.length === 0 && <p className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">No pending requests.</p>}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Squad Tips</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Challenge friends inside active competitions for extra motivation.</li>
              <li>Follow athletes near your rank to find realistic rivals.</li>
              <li>Use private groups for teams, schools, and company leagues.</li>
            </ul>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
};

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
