'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Footprints, Flame, TrendingUp, Calendar, Play, Pause, RotateCcw } from 'lucide-react';

export default function ActivityPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);

  // Mock real-time step tracking
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setSteps((prev) => prev + Math.floor(Math.random() * 10));
        setDistance((prev) => prev + Math.random() * 0.01);
        setCalories((prev) => prev + Math.random() * 0.5);
        setActiveMinutes((prev) => prev + 0.1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const handleStartStop = () => {
    setIsTracking(!isTracking);
  };

  const handleReset = () => {
    setSteps(0);
    setDistance(0);
    setCalories(0);
    setActiveMinutes(0);
    setIsTracking(false);
  };

  const weeklyData = [
    { day: 'Mon', steps: 8234, calories: 412 },
    { day: 'Tue', steps: 10521, calories: 526 },
    { day: 'Wed', steps: 9876, calories: 494 },
    { day: 'Thu', steps: 12340, calories: 617 },
    { day: 'Fri', steps: 7654, calories: 383 },
    { day: 'Sat', steps: 15230, calories: 762 },
    { day: 'Sun', steps: 11234, calories: 562 },
  ];

  const recentActivities = [
    { id: 1, type: 'walk', title: 'Morning Walk', steps: 5234, duration: '45 min', time: '2 hours ago' },
    { id: 2, type: 'run', title: 'Evening Run', steps: 8912, duration: '60 min', time: '5 hours ago' },
    { id: 3, type: 'walk', title: 'Lunch Break Walk', steps: 2134, duration: '20 min', time: '1 day ago' },
    { id: 4, type: 'cycle', title: 'Bike Ride', steps: 0, duration: '90 min', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Activity Tracker</h1>
        <p className="text-muted-foreground">
          Track your steps and activities in real-time
        </p>
      </div>

      {/* Live Tracker */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Live Activity Tracker
          </CardTitle>
          <CardDescription className="text-white/80">
            Track your steps using device sensors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <Footprints className="h-8 w-8 mx-auto mb-2 opacity-90" />
              <p className="text-sm opacity-80 mb-1">Steps</p>
              <p className="text-4xl font-bold">{steps.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-90" />
              <p className="text-sm opacity-80 mb-1">Distance (km)</p>
              <p className="text-4xl font-bold">{distance.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <Flame className="h-8 w-8 mx-auto mb-2 opacity-90" />
              <p className="text-sm opacity-80 mb-1">Calories</p>
              <p className="text-4xl font-bold">{Math.floor(calories)}</p>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-90" />
              <p className="text-sm opacity-80 mb-1">Active (min)</p>
              <p className="text-4xl font-bold">{Math.floor(activeMinutes)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center">
            <Button
              onClick={handleStartStop}
              size="lg"
              variant="secondary"
              className="gap-2"
            >
              {isTracking ? (
                <>
                  <Pause className="h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Start Tracking
                </>
              )}
            </Button>
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>

          {isTracking && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">Tracking active</span>
              </div>
            </div>
          )}
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
                <span className="text-sm font-semibold">{steps + 5234} / 10,000</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min(((steps + 5234) / 10000) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Calories Goal (500)</span>
                <span className="text-sm font-semibold">{Math.floor(calories + 234)} / 500</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${Math.min(((calories + 234) / 500) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Minutes (60)</span>
                <span className="text-sm font-semibold">{Math.floor(activeMinutes + 28)} / 60</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(((activeMinutes + 28) / 60) * 100, 100)}%` }}
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
          <div className="h-80">
            <div className="flex items-end justify-around h-full gap-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 w-full flex flex-col justify-end gap-1">
                    {/* Steps bar */}
                    <div className="relative group">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-md transition-all hover:opacity-80 cursor-pointer"
                        style={{ height: `${(day.steps / 16000) * 100}%`, minHeight: '20px' }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.steps.toLocaleString()} steps
                      </div>
                    </div>
                    {/* Calories bar */}
                    <div className="relative group">
                      <div
                        className="w-full bg-gradient-to-t from-orange-500 to-red-500 rounded-t-md transition-all hover:opacity-80 cursor-pointer"
                        style={{ height: `${(day.calories / 800) * 100}%`, minHeight: '10px' }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.calories} calories
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{day.day}</span>
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
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your latest tracked activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    activity.type === 'walk' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'run' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'walk' ? '🚶' : activity.type === 'run' ? '🏃' : '🚴'}
                  </div>
                  <div>
                    <p className="font-semibold">{activity.title}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {activity.steps > 0 && (
                        <span>{activity.steps.toLocaleString()} steps</span>
                      )}
                      <span>{activity.duration}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
