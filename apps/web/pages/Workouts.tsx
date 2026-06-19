import React, { useMemo, useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { Dumbbell, Footprints, Flame, Timer, Plus, Activity, TrendingUp } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData } from '../lib/apiHelpers';
import { fallbackWorkouts, normalizeWorkouts, type WorkoutItem } from '../lib/healthData';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MetricCard } from '../components/ui/MetricCard';
import { PageShell } from '../components/ui/PageShell';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeader } from '../components/ui/SectionHeader';

const motion = motionBase as any;

  const quickWorkouts = [
  { title: 'Quick Run', type: 'Run' as const, duration: 30, calories: 260, intensity: 'Moderate' as const },
  { title: 'Strength Circuit', type: 'Strength' as const, duration: 45, calories: 340, intensity: 'Hard' as const },
  { title: 'Recovery Walk', type: 'Walk' as const, duration: 25, calories: 120, intensity: 'Easy' as const },
] as const;

export const Workouts: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState('All');
  const [customTitle, setCustomTitle] = useState('');
  const [customDuration, setCustomDuration] = useState(30);

  const { data: workoutResponse } = useQuery({
    queryKey: ['web-workouts'],
    queryFn: () => api.getWorkoutHistory().catch(() => null),
  });

  const workouts = useMemo(() => normalizeWorkouts(unwrapData<any[]>(workoutResponse)), [workoutResponse]);
  const filteredWorkouts = selectedType === 'All' ? workouts : workouts.filter((workout) => workout.type === selectedType);
  const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);

  const createWorkoutMutation = useMutation({
    mutationFn: (data: Partial<WorkoutItem>) => api.createWorkout(data).catch(() => null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web-workouts'] });
      setCustomTitle('');
      setCustomDuration(30);
    },
  });

  const addWorkout = (workout: Partial<WorkoutItem>) => {
    createWorkoutMutation.mutate({
      title: workout.title,
      type: workout.type,
      duration: workout.duration,
      calories: workout.calories,
      intensity: workout.intensity,
    } as any);
  };

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Workout log"
        title="Track Every Rep"
        description="Log workouts quickly and keep your competition score moving with verified activity."
        action={<Badge variant="live">Sync Ready</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon={<Footprints size={20} />} value={totalDuration} label="Minutes trained" sublabel="This week" />
        <MetricCard icon={<Flame size={20} />} value={totalCalories.toLocaleString()} label="Calories burned" sublabel="Estimated" />
        <MetricCard icon={<Activity size={20} />} value={workouts.length} label="Workouts logged" sublabel="Recent history" />
        <MetricCard icon={<TrendingUp size={20} />} value="Hard" label="Last intensity" sublabel="Training load" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {['All', 'Run', 'Strength', 'Cycle', 'Yoga', 'Walk', 'Swim'].map((type) => (
              <button
                key={type}
                className={`btn-mobile ${selectedType === type ? 'bg-primary text-primary-foreground' : 'btn-secondary'}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredWorkouts.map((workout, index) => (
              <motion.div key={workout.id} className="card-mobile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {workout.type === 'Strength' ? <Dumbbell size={20} /> : workout.type === 'Run' || workout.type === 'Walk' ? <Footprints size={20} /> : <Activity size={20} />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">{workout.title}</h3>
                        <Badge variant={workout.intensity === 'Hard' ? 'danger' : workout.intensity === 'Moderate' ? 'primary' : 'success'}>{workout.intensity}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{workout.type} • {workout.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold tabular">{workout.duration}m</div>
                    <div className="text-xs text-muted-foreground">{workout.calories} kcal</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Timer size={20} /></div>
              <div>
                <h2 className="text-lg font-semibold">Weekly Training Load</h2>
                <p className="text-sm text-muted-foreground">Balance effort and recovery.</p>
              </div>
            </div>
            <div className="space-y-4">
              <ProgressRow label="Cardio" value={68} />
              <ProgressRow label="Strength" value={54} />
              <ProgressRow label="Recovery" value={72} />
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Plus size={20} /></div>
              <div>
                <h2 className="text-lg font-semibold">Quick Add</h2>
                <p className="text-sm text-muted-foreground">Save a workout now.</p>
              </div>
            </div>
            <div className="space-y-3">
              {quickWorkouts.map((workout) => (
                <button key={workout.title} className="btn-secondary w-full justify-between" onClick={() => addWorkout(workout)}>
                  <span>{workout.title}</span>
                  <span className="text-xs text-muted-foreground">{workout.duration}m • {workout.calories} kcal</span>
                </button>
              ))}
              <input className="input-mobile" placeholder="Custom workout name" value={customTitle} onChange={(event) => setCustomTitle(event.target.value)} />
              <input className="input-mobile" type="number" min={5} max={240} value={customDuration} onChange={(event) => setCustomDuration(Number(event.target.value || 30))} />
              <Button className="w-full" disabled={!customTitle.trim() || createWorkoutMutation.isPending} onClick={() => addWorkout({ title: customTitle, type: 'Run', duration: customDuration, calories: Math.round(customDuration * 8), intensity: 'Moderate' })}>
                Save Custom Workout
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
};

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-semibold text-muted-foreground">{value}%</span>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}
