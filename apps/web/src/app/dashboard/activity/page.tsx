'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Footprints, Flame, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { api, DailyActivity, ActivityLog } from '@/lib/api';

export default function ActivityPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<DailyActivity[]>([]);
  const [todayData, setTodayData] = useState<DailyActivity | null>(null);

  // Fetch activity data
  useEffect(() => {
    const fetchActivity = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        // Fetch last 7 days of activity
        const data = await api.user.getActivity(user.id, 7);
        setWeeklyData(data);
        
        // Get today's data
        const today = new Date().toISOString().split('T')[0];
        const todayActivity = data.find(d => d.date.startsWith(today));
        setTodayData(todayActivity || { date: today, steps: 0, calories: 0, distance: 0 });
      } catch (error) {
        console.error('Failed to load activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Activity Tracker</h1>
        <p className="text-muted-foreground">
          View your fitness data synced from mobile app
        </p>
      </div>

      {/* Today's Stats */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Today's Activity
          </CardTitle>
          <CardDescription className="text-white/80">
            Data synced from your mobile device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Footprints className="h-8 w-8 mx-auto mb-2 opacity-90" />
              <p className="text-sm opacity-80 mb-1">Steps</p>
              <p className="text-4xl font-bold">{todayData?.steps.toLocaleString() || 0}</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-90" />
              <p className="text-sm opacity-80 mb-1">Distance (km)</p>
              <p className="text-4xl font-bold">{todayData?.distance.toFixed(2) || '0.00'}</p>
            </div>
            <div className="text-center">
              <Flame className="h-8 w-8 mx-auto mb-2 opacity-90" />
              <p className="text-sm opacity-80 mb-1">Calories</p>
              <p className="text-4xl font-bold">{Math.floor(todayData?.calories || 0)}</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              💡 Use the mobile app to track your steps in real-time
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
          <CardDescription>Your activity summary for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Steps Goal (10,000)</span>
                <span className="text-sm font-semibold">{todayData?.steps.toLocaleString() || 0} / 10,000</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min(((todayData?.steps || 0) / 10000) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Calories Goal (500)</span>
                <span className="text-sm font-semibold">{Math.floor(todayData?.calories || 0)} / 500</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${Math.min(((todayData?.calories || 0) / 500) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Distance Goal (5 km)</span>
                <span className="text-sm font-semibold">{todayData?.distance.toFixed(2) || '0.00'} / 5.00 km</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(((todayData?.distance || 0) / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Your activity for the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {weeklyData.length > 0 ? (
            <>
              <div className="h-80">
                <div className="flex items-end justify-around h-full gap-2">
                  {weeklyData.reverse().map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="flex-1 w-full flex flex-col justify-end gap-1">
                        {/* Steps bar */}
                        <div className="relative group">
                          <div
                            className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-md transition-all hover:opacity-80 cursor-pointer"
                            style={{ height: `${Math.min((day.steps / 15000) * 100, 100)}%`, minHeight: day.steps > 0 ? '20px' : '5px' }}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {day.steps.toLocaleString()} steps
                          </div>
                        </div>
                        {/* Calories bar */}
                        <div className="relative group">
                          <div
                            className="w-full bg-gradient-to-t from-orange-500 to-red-500 rounded-t-md transition-all hover:opacity-80 cursor-pointer"
                            style={{ height: `${Math.min((day.calories / 800) * 100, 100)}%`, minHeight: day.calories > 0 ? '10px' : '5px' }}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {Math.floor(day.calories)} calories
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{getDayName(day.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
                  <span className="text-sm">Steps</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded" />
                  <span className="text-sm">Calories</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No activity data yet. Start tracking with the mobile app!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
          <CardDescription>Daily breakdown of your tracked activities</CardDescription>
        </CardHeader>
        <CardContent>
          {weeklyData.length > 0 ? (
            <div className="space-y-3">
              {weeklyData.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      🚶
                    </div>
                    <div>
                      <p className="font-semibold">{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{activity.steps.toLocaleString()} steps</span>
                        <span>•</span>
                        <span>{activity.distance.toFixed(2)} km</span>
                        <span>•</span>
                        <span>{Math.floor(activity.calories)} kcal</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No activity data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

