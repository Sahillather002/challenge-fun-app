-- Supabase Database Schema for Health Competition App
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar TEXT,
    profile_image TEXT,
    company TEXT,
    department TEXT,
    total_steps INTEGER DEFAULT 0,
    competitions_won INTEGER DEFAULT 0,
    joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitions table
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT CHECK (type IN ('weekly', 'monthly')) DEFAULT 'weekly',
    entry_fee INTEGER DEFAULT 50,
    prize_pool INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    participants UUID[] DEFAULT '{}',
    status TEXT CHECK (status IN ('upcoming', 'active', 'completed')) DEFAULT 'upcoming',
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    rules TEXT[] DEFAULT '{}',
    prizes JSONB DEFAULT '{"first": 100, "second": 50, "third": 25}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step data table
CREATE TABLE IF NOT EXISTS public.steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    steps INTEGER NOT NULL DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, competition_id, date)
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    payment_method TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE NOT NULL,
    position INTEGER CHECK (position IN (1, 2, 3)) NOT NULL,
    amount INTEGER NOT NULL,
    claimed BOOLEAN DEFAULT FALSE,
    claimed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_competitions_status ON public.competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_created_by ON public.competitions(created_by);
CREATE INDEX IF NOT EXISTS idx_steps_user_competition ON public.steps(user_id, competition_id);
CREATE INDEX IF NOT EXISTS idx_steps_date ON public.steps(date);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON public.rewards(user_id);

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view other users for leaderboards" ON public.users;
DROP POLICY IF EXISTS "Anyone can view competitions" ON public.competitions;
DROP POLICY IF EXISTS "Authenticated users can create competitions" ON public.competitions;
DROP POLICY IF EXISTS "Competition creators can update their competitions" ON public.competitions;
DROP POLICY IF EXISTS "Competition creators can delete their competitions" ON public.competitions;
DROP POLICY IF EXISTS "Users can view their own steps" ON public.steps;
DROP POLICY IF EXISTS "Users can insert their own steps" ON public.steps;
DROP POLICY IF EXISTS "Users can update their own steps" ON public.steps;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view their own rewards" ON public.rewards;
DROP POLICY IF EXISTS "Users can update their own rewards" ON public.rewards;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view other users for leaderboards" ON public.users
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for competitions table
CREATE POLICY "Anyone can view competitions" ON public.competitions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create competitions" ON public.competitions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Competition creators can update their competitions" ON public.competitions
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Competition creators can delete their competitions" ON public.competitions
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for steps table
CREATE POLICY "Users can view their own steps" ON public.steps
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own steps" ON public.steps
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own steps" ON public.steps
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for payments table
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for rewards table
CREATE POLICY "Users can view their own rewards" ON public.rewards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards" ON public.rewards
    FOR UPDATE USING (auth.uid() = user_id);

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_competitions_updated_at ON public.competitions;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON public.competitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
