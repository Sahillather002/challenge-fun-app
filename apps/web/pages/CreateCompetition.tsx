import React, { useMemo, useState } from 'react';
import { Trophy, Users, Clock, DollarSign, ShieldCheck, Plus, ArrowRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { fallbackCompetitionTemplates } from '../lib/healthData';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageShell } from '../components/ui/PageShell';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeader } from '../components/ui/SectionHeader';

export const CreateCompetition: React.FC = () => {
  const [title, setTitle] = useState('Weekend Step Surge');
  const [category, setCategory] = useState('Steps');
  const [prizePool, setPrizePool] = useState(500);
  const [entryFee, setEntryFee] = useState(0);
  const [duration, setDuration] = useState(24);
  const [rules, setRules] = useState('Daily steps sync before midnight.\nTop average daily steps wins.\nManual step entries are reviewed.');
  const [selectedTemplate, setSelectedTemplate] = useState(fallbackCompetitionTemplates[0]);

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createCompetition(data).catch(() => null),
  });

  const readiness = useMemo(() => {
    const checks = [title.trim().length > 3, prizePool >= 0, entryFee >= 0, duration > 0, rules.trim().split('\n').filter(Boolean).length >= 2];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [title, prizePool, entryFee, duration, rules]);

  const applyTemplate = () => {
    setTitle(selectedTemplate.title);
    setCategory(selectedTemplate.category);
    setRules(selectedTemplate.rules.join('\n'));
  };

  const handleCreate = () => {
    createMutation.mutate({
      title,
      category,
      prizePool,
      entryFee,
      duration,
      rules: rules.split('\n').filter(Boolean),
      status: 'ACTIVE',
    });
  };

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Competition builder"
        title="Create A Battle"
        description="Build a frontend-ready competition flow now; backend validation and Supabase syncing can be connected later."
        action={<Badge variant={readiness === 100 ? 'success' : 'warning'}>{readiness}% Ready</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Battle Details</h2>
              <p className="text-sm text-muted-foreground">Use a template or customize every field.</p>
            </div>
            <Button size="sm" onClick={applyTemplate}><ArrowRight size={16} /> Apply Template</Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</span>
              <input className="input-mobile" value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</span>
              <select className="input-mobile" value={category} onChange={(event) => setCategory(event.target.value)}>
                {['Steps', 'Strength', 'Cardio', 'Endurance', 'Wellness'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prize Pool</span>
              <input className="input-mobile" type="number" min={0} value={prizePool} onChange={(event) => setPrizePool(Number(event.target.value || 0))} />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Entry Fee</span>
              <input className="input-mobile" type="number" min={0} value={entryFee} onChange={(event) => setEntryFee(Number(event.target.value || 0))} />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Duration Hours</span>
              <input className="input-mobile" type="number" min={1} max={168} value={duration} onChange={(event) => setDuration(Number(event.target.value || 1))} />
            </label>
          </div>

          <label className="mt-5 block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rules</span>
            <textarea className="input-mobile min-h-[140px] resize-y" value={rules} onChange={(event) => setRules(event.target.value)} />
          </label>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Creation readiness</span>
              <span className="font-semibold text-muted-foreground">{readiness}%</span>
            </div>
            <ProgressBar value={readiness} />
          </div>

          <Button className="mt-6 w-full" disabled={readiness < 100 || createMutation.isPending} onClick={handleCreate}>
            <Plus size={18} /> Publish Competition
          </Button>
        </Card>

        <aside className="space-y-5">
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Trophy size={20} /></div>
              <div>
                <h2 className="text-lg font-semibold">Preview Card</h2>
                <p className="text-sm text-muted-foreground">How athletes will see it.</p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-5 text-primary-foreground">
              <Badge variant="live">LIVE</Badge>
              <h3 className="mt-4 text-2xl font-bold">{title}</h3>
              <p className="mt-2 text-sm opacity-90">{category} battle</p>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <PreviewMetric icon={<DollarSign size={18} />} label="Prize" value={`$${prizePool}`} />
              <PreviewMetric icon={<Users size={18} />} label="Fee" value={entryFee ? `$${entryFee}` : 'Free'} />
              <PreviewMetric icon={<Clock size={18} />} label="Duration" value={`${duration}h`} />
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck size={20} /></div>
              <div>
                <h2 className="text-lg font-semibold">Templates</h2>
                <p className="text-sm text-muted-foreground">Fast presets for common battles.</p>
              </div>
            </div>
            <div className="space-y-3">
              {fallbackCompetitionTemplates.map((template) => (
                <button key={template.id} className={`w-full rounded-xl border p-4 text-left transition-all ${selectedTemplate.id === template.id ? 'border-primary bg-primary/5' : 'border-border bg-muted/40 hover:bg-muted'}`} onClick={() => setSelectedTemplate(template)}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-foreground">{template.title}</span>
                    <Badge variant="primary">{template.category}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{template.description}</p>
                </button>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
};

function PreviewMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-primary-foreground/10 p-3">
      <div className="text-primary-foreground">{icon}</div>
      <div className="mt-2 text-xs opacity-70">{label}</div>
      <div className="mt-1 text-sm font-semibold tabular">{value}</div>
    </div>
  );
}
