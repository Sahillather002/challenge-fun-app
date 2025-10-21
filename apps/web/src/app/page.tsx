'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Health Competition
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Compete. Track. Win.
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Join fitness competitions, track your progress in real-time, and win amazing prizes.
            The ultimate health and fitness competition platform.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="auth/register">
              <Button size="lg" className="text-lg">
                Start Competing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="auth/login">
              <Button size="lg" variant="outline" className="text-lg">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <FeatureCard
            icon={<Trophy className="h-12 w-12 text-yellow-500" />}
            title="Win Prizes"
            description="Compete in challenges and win real cash prizes based on your performance"
          />
          <FeatureCard
            icon={<TrendingUp className="h-12 w-12 text-green-500" />}
            title="Track Progress"
            description="Built-in step tracker monitors your activity in real-time without external apps"
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-blue-500" />}
            title="Join Competitions"
            description="Participate in various fitness competitions with people around the world"
          />
          <FeatureCard
            icon={<Zap className="h-12 w-12 text-purple-500" />}
            title="Real-time Updates"
            description="See live leaderboards and instant updates on your ranking and progress"
          />
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 mb-20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="10K+" label="Active Users" />
            <StatCard number="500+" label="Competitions" />
            <StatCard number="$50K+" label="Prizes Awarded" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users competing to be healthier and win prizes
          </p>
          <Link href="auth/register">
            <Button size="lg" variant="secondary" className="text-lg">
              Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Health Competition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow card-hover">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}
