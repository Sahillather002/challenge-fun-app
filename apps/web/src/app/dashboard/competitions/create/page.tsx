'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function CreateCompetitionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'steps',
    entryFee: '',
    prizePool: '',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    rules: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: 'Success!',
        description: 'Competition created successfully',
      });

      router.push('/dashboard/competitions');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create competition',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/competitions">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Competitions
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Create New Competition</h1>
        </div>
        <p className="text-muted-foreground">
          Set up a new fitness competition and invite others to join
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Competition Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your competition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Competition Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., 30-Day Step Challenge"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your competition..."
                  value={formData.description}
                  onChange={handleChange}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-2">
                  Competition Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="steps">Steps</option>
                  <option value="distance">Distance</option>
                  <option value="calories">Calories</option>
                  <option value="active_minutes">Active Minutes</option>
                </select>
              </div>
            </div>

            {/* Financial Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="entryFee" className="block text-sm font-medium mb-2">
                  Entry Fee ($) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="entryFee"
                  name="entryFee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="25.00"
                  value={formData.entryFee}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="prizePool" className="block text-sm font-medium mb-2">
                  Prize Pool ($) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="prizePool"
                  name="prizePool"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="500.00"
                  value={formData.prizePool}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium mb-2">
                Max Participants (optional)
              </label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="2"
                placeholder="Unlimited"
                value={formData.maxParticipants}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="rules" className="block text-sm font-medium mb-2">
                Competition Rules (optional)
              </label>
              <textarea
                id="rules"
                name="rules"
                placeholder="Any specific rules or guidelines..."
                value={formData.rules}
                onChange={handleChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link href="/dashboard/competitions">
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Competition'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
