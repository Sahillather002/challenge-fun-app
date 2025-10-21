-- Health Competition Platform Database Schema
-- PostgreSQL Database Schema for Competition, User, and Fitness Tracking
-- Version 2: Works with Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.prizes CASCADE;
DROP TABLE IF EXISTS public.leaderboard_entries CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.fitness_data CASCADE;
DROP TABLE IF EXISTS public.competition_participants CASCADE;
DROP TABLE IF EXISTS public.competitions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Users table (extends Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar TEXT,
    bio TEXT,
    country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitions table
CREATE TABLE public.competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    entry_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    prize_pool DECIMAL(10, 2) NOT NULL DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('upcoming', 'active', 'completed')),
    type VARCHAR(50) NOT NULL,
    creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competition participants junction table
CREATE TABLE public.competition_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(competition_id, user_id)
);

-- Fitness data tracking
CREATE TABLE public.fitness_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
    steps BIGINT NOT NULL DEFAULT 0,
    distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    calories DECIMAL(10, 2) NOT NULL DEFAULT 0,
    active_minutes INTEGER NOT NULL DEFAULT 0,
    source VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, competition_id, date)
);

-- Activity logs for recent activity display
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    steps BIGINT NOT NULL DEFAULT 0,
    calories DECIMAL(10, 2) NOT NULL DEFAULT 0,
    distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard entries (cached/computed)
CREATE TABLE public.leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    score BIGINT NOT NULL DEFAULT 0,
    rank INTEGER NOT NULL,
    steps BIGINT NOT NULL DEFAULT 0,
    distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    calories DECIMAL(10, 2) NOT NULL DEFAULT 0,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, competition_id)
);

-- Prize distribution
CREATE TABLE public.prizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'distributed', 'failed')),
    distributed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('entry_fee', 'prize', 'refund')),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    description TEXT,
    payment_method VARCHAR(50),
    transaction_ref VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance optimization
CREATE INDEX idx_competitions_status ON public.competitions(status);
CREATE INDEX idx_competitions_dates ON public.competitions(start_date, end_date);
CREATE INDEX idx_competitions_creator ON public.competitions(creator_id);
CREATE INDEX idx_comp_participants_user ON public.competition_participants(user_id);
CREATE INDEX idx_comp_participants_comp ON public.competition_participants(competition_id);
CREATE INDEX idx_fitness_data_user_date ON public.fitness_data(user_id, date DESC);
CREATE INDEX idx_fitness_data_comp ON public.fitness_data(competition_id);
CREATE INDEX idx_fitness_data_date ON public.fitness_data(date DESC);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);
CREATE INDEX idx_leaderboard_comp_rank ON public.leaderboard_entries(competition_id, rank);
CREATE INDEX idx_leaderboard_user ON public.leaderboard_entries(user_id);
CREATE INDEX idx_prizes_comp ON public.prizes(competition_id);
CREATE INDEX idx_prizes_user ON public.prizes(user_id);
CREATE INDEX idx_transactions_user ON public.transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_comp ON public.transactions(competition_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON public.competitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON public.leaderboard_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NOW(),
        NOW()
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- User already exists, ignore
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Competitions are viewable by everyone" ON public.competitions;
DROP POLICY IF EXISTS "Authenticated users can create competitions" ON public.competitions;
DROP POLICY IF EXISTS "Participants viewable by everyone" ON public.competition_participants;
DROP POLICY IF EXISTS "Users can join competitions" ON public.competition_participants;
DROP POLICY IF EXISTS "Users can view own fitness data" ON public.fitness_data;
DROP POLICY IF EXISTS "Users can insert own fitness data" ON public.fitness_data;
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can create own activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Leaderboards are viewable by everyone" ON public.leaderboard_entries;
DROP POLICY IF EXISTS "Prizes are viewable by everyone" ON public.prizes;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Competitions are viewable by everyone" ON public.competitions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create competitions" ON public.competitions
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Participants viewable by everyone" ON public.competition_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join competitions" ON public.competition_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own fitness data" ON public.fitness_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fitness data" ON public.fitness_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own activity logs" ON public.activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Leaderboards are viewable by everyone" ON public.leaderboard_entries
    FOR SELECT USING (true);

CREATE POLICY "Prizes are viewable by everyone" ON public.prizes
    FOR SELECT USING (true);

CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Views for common queries
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    COALESCE(SUM(fd.steps), 0) as total_steps,
    COALESCE(SUM(fd.calories), 0) as total_calories,
    COALESCE(SUM(fd.distance), 0) as total_distance,
    COUNT(DISTINCT cp.competition_id) as competitions_joined,
    COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_competitions,
    COALESCE(SUM(p.amount), 0) as total_prize_winnings
FROM public.users u
LEFT JOIN public.fitness_data fd ON fd.user_id = u.id
LEFT JOIN public.competition_participants cp ON cp.user_id = u.id
LEFT JOIN public.competitions c ON c.id = cp.competition_id
LEFT JOIN public.prizes p ON p.user_id = u.id AND p.status = 'distributed'
GROUP BY u.id, u.name, u.email;

CREATE OR REPLACE VIEW competition_summary AS
SELECT 
    c.id,
    c.name,
    c.description,
    c.entry_fee,
    c.prize_pool,
    c.start_date,
    c.end_date,
    c.status,
    c.type,
    COUNT(DISTINCT cp.user_id) as participant_count,
    COALESCE(SUM(fd.steps), 0) as total_steps,
    COALESCE(SUM(fd.calories), 0) as total_calories,
    c.created_at
FROM public.competitions c
LEFT JOIN public.competition_participants cp ON cp.competition_id = c.id
LEFT JOIN public.fitness_data fd ON fd.competition_id = c.id
GROUP BY c.id, c.name, c.description, c.entry_fee, c.prize_pool, c.start_date, c.end_date, c.status, c.type, c.created_at;

-- Sync existing Supabase Auth users to custom users table
-- This ensures users who already exist in auth.users get a profile in our custom table
INSERT INTO public.users (id, email, name, created_at, updated_at)
SELECT
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', au.raw_user_meta_data->>'full_name', 'User') as name,
    au.created_at,
    NOW()
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Create a function to auto-sync new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.created_at,
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists (to avoid "already exists" error)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically sync new auth users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Comments
COMMENT ON TABLE public.users IS 'User profile information extending Supabase Auth';
COMMENT ON TABLE public.competitions IS 'Fitness competitions with entry fees and prize pools';
COMMENT ON TABLE public.competition_participants IS 'Junction table for user competition participation';
COMMENT ON TABLE public.fitness_data IS 'Daily fitness tracking data from mobile apps';
COMMENT ON TABLE public.activity_logs IS 'Individual activity sessions for display';
COMMENT ON TABLE public.leaderboard_entries IS 'Cached leaderboard rankings per competition';
COMMENT ON TABLE public.prizes IS 'Prize distribution records';
COMMENT ON TABLE public.transactions IS 'Financial transactions for entry fees and prizes';
