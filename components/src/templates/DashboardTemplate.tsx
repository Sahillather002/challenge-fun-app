import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { StatCard } from '../molecules/StatCard';
import { CompetitionCard } from '../molecules/CompetitionCard';
import { Input } from '../atoms/Input';

export const DashboardTemplate: React.FC = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for demonstration
  const stats = [
    { label: 'Total Steps', value: '12,450', change: '+12.5%', isUp: true, icon: '🚶' },
    { label: 'Calories Burned', value: '2,340', change: '+8.2%', isUp: true, icon: '🔥' },
    { label: 'Active Competitions', value: '3', change: 'Live', isUp: true, icon: '🏆' },
    { label: 'Best Rank', value: '#12', change: 'Top', isUp: true, icon: '📈' },
  ];

  const competitions = [
    {
      id: '1',
      title: 'Summer Fitness Challenge',
      participants: 128,
      prize: '₹5,000',
      progress: 68,
      endDate: 'Oct 31',
      isActive: true,
    },
    {
      id: '2',
      title: 'Daily Steps Marathon',
      participants: 89,
      prize: '₹2,500',
      progress: 45,
      endDate: 'Nov 15',
      isActive: true,
    },
    {
      id: '3',
      title: 'Weekend Warrior',
      participants: 45,
      prize: '₹1,000',
      progress: 92,
      endDate: 'Nov 05',
      isActive: true,
    },
  ];

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md" style={{ backgroundColor: colors.card, borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-black" style={{ color: colors.natureGreen }}>
                  FITCOMP
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <span>👤</span> Profile
              </Button>
              <Button variant="ghost" size="sm">
                <span>🔔</span> Notifications
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-black mb-2" style={{ color: colors.textPrimary }}>
            Welcome back!
          </h2>
          <p style={{ color: colors.textSecondary }}>
            Track your progress and compete with friends
          </p>
        </div>

        {/* Search and Quick Actions */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Input
            placeholder="Search competitions, friends, or activities..."
            value={searchQuery}
            onChange={setSearchQuery}
            prefix={<span>🔍</span>}
            className="max-w-md"
          />
          <Button variant="primary">
            <span>➕</span> Create Competition
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              isUp={stat.isUp}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Recent Competitions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              Active Competitions
            </h3>
            <Button variant="secondary" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                id={competition.id}
                title={competition.title}
                participants={competition.participants}
                prize={competition.prize}
                progress={competition.progress}
                endDate={competition.endDate}
                isActive={competition.isActive}
                onClick={(id) => console.log('Competition clicked:', id)}
              />
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <Card glass={true} elevated={true} padding="lg" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              Weekly Activity
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">📈</Button>
              <Button variant="ghost" size="sm">📊</Button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center" style={{ color: colors.textSecondary }}>
              <div className="text-4xl mb-2">📊</div>
              <p>Chart visualization will appear here</p>
            </div>
          </div>
        </Card>

        {/* Quick Tips */}
        <Card glass={true} elevated={true} padding="lg">
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Quick Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardSecondary }}>
              <div className="text-2xl mb-2">💧</div>
              <h4 className="font-bold mb-1" style={{ color: colors.textPrimary }}>Stay Hydrated</h4>
              <p style={{ color: colors.textSecondary }}>Drink at least 8 glasses of water daily</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardSecondary }}>
              <div className="text-2xl mb-2">🥗</div>
              <h4 className="font-bold mb-1" style={{ color: colors.textPrimary }}>Healthy Eating</h4>
              <p style={{ color: colors.textSecondary }}>Include 5 servings of fruits and vegetables</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardSecondary }}>
              <div className="text-2xl mb-2">🏃</div>
              <h4 className="font-bold mb-1" style={{ color: colors.textPrimary }}>Daily Steps</h4>
              <p style={{ color: colors.textSecondary }}>Aim for 10,000 steps per day</p>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4" style={{ color: colors.textPrimary }}>FITCOMP</h4>
              <p style={{ color: colors.textSecondary }}>
                Track your fitness journey and compete with friends to stay motivated.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: colors.textPrimary }}>Features</h4>
              <ul className="space-y-2">
                <li><a href="#" style={{ color: colors.textSecondary }}>Competitions</a></li>
                <li><a href="#" style={{ color: colors.textSecondary }}>Leaderboards</a></li>
                <li><a href="#" style={{ color: colors.textSecondary }}>Rewards</a></li>
                <li><a href="#" style={{ color: colors.textSecondary }}>Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: colors.textPrimary }}>Support</h4>
              <ul className="space-y-2">
                <li><a href="#" style={{ color: colors.textSecondary }}>Help Center</a></li>
                <li><a href="#" style={{ color: colors.textSecondary }}>FAQ</a></li>
                <li><a href="#" style={{ color: colors.textSecondary }}>Contact Us</a></li>
                <li><a href="#" style={{ color: colors.textSecondary }}>Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: colors.textPrimary }}>Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" style={{ color: colors.textSecondary }}>📘</a>
                <a href="#" style={{ color: colors.textSecondary }}>🐦</a>
                <a href="#" style={{ color: colors.textSecondary }}>📷</a>
                <a href="#" style={{ color: colors.textSecondary }}>💬</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: colors.border }}>
            <p style={{ color: colors.textSecondary }}>
              © 2024 FITCOMP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
