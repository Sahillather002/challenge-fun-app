-- Health Competition Platform Database Schema
-- PostgreSQL Database Schema for Competition, User, and Fitness Tracking

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
-- This syncs with auth.users via triggers
CREATE TABLE IF NOT EXISTS public.users (
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
CREATE TABLE IF NOT EXISTS public.competitions (
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
CREATE TABLE IF NOT EXISTS competition_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(competition_id, user_id)
);

-- Fitness data tracking
CREATE TABLE IF NOT EXISTS fitness_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    steps BIGINT NOT NULL DEFAULT 0,
    distance DECIMAL(10, 2) NOT NULL DEFAULT 0, -- in meters
    calories DECIMAL(10, 2) NOT NULL DEFAULT 0,
    active_minutes INTEGER NOT NULL DEFAULT 0,
    source VARCHAR(50) NOT NULL, -- google_fit, apple_health, manual, etc.
    date DATE NOT NULL,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, competition_id, date)
);

-- Activity logs for recent activity display
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- workout, walk, run, cycle, etc.
    steps BIGINT NOT NULL DEFAULT 0,
    calories DECIMAL(10, 2) NOT NULL DEFAULT 0,
    distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL DEFAULT 0, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard entries (cached/computed)
CREATE TABLE IF NOT EXISTS leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS prizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'distributed', 'failed')),
    distributed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES competitions(id) ON DELETE SET NULL,
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

-- Competition indexes
CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_dates ON competitions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_competitions_creator ON competitions(creator_id);

-- Competition participants indexes
CREATE INDEX IF NOT EXISTS idx_comp_participants_user ON competition_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_comp_participants_comp ON competition_participants(competition_id);

-- Fitness data indexes
CREATE INDEX IF NOT EXISTS idx_fitness_data_user_date ON fitness_data(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_fitness_data_comp ON fitness_data(competition_id);
CREATE INDEX IF NOT EXISTS idx_fitness_data_date ON fitness_data(date DESC);

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id, created_at DESC);

-- Leaderboard indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_comp_rank ON leaderboard_entries(competition_id, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON leaderboard_entries(user_id);

-- Prize indexes
CREATE INDEX IF NOT EXISTS idx_prizes_comp ON prizes(competition_id);
CREATE INDEX IF NOT EXISTS idx_prizes_user ON prizes(user_id);

-- Transaction indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_comp ON transactions(competition_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON leaderboard_entries
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sample data (optional - for development)
-- Uncomment to insert sample data

/*
-- Insert sample user (assuming Supabase auth user exists)
INSERT INTO users (id, email, name, country) VALUES
('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo User', 'USA');

-- Insert sample competitions
INSERT INTO competitions (id, name, description, entry_fee, prize_pool, start_date, end_date, status, type) VALUES
('11111111-1111-1111-1111-111111111111', 
 '30-Day Step Challenge', 
 'Walk your way to victory! Complete 10,000 steps daily for 30 days.',
 25.00,
 500.00,
 NOW(),
 NOW() + INTERVAL '30 days',
 'active',
 'steps'),
('22222222-2222-2222-2222-222222222222',
 'Weekend Warriors',
 'Intense weekend fitness competition. Most active minutes wins!',
 15.00,
 250.00,
 NOW() + INTERVAL '1 day',
 NOW() + INTERVAL '3 days',
 'upcoming',
 'active_minutes');

-- Join sample user to competition
INSERT INTO competition_participants (competition_id, user_id) VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001');

-- Insert sample fitness data
INSERT INTO fitness_data (user_id, competition_id, steps, distance, calories, active_minutes, source, date) VALUES
('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 8500, 6.8, 425, 45, 'google_fit', CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 10200, 8.1, 510, 60, 'google_fit', CURRENT_DATE - INTERVAL '1 day'),
('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 7800, 6.2, 390, 40, 'google_fit', CURRENT_DATE - INTERVAL '2 days');

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, title, type, steps, calories, distance, duration) VALUES
('00000000-0000-0000-0000-000000000001', 'Morning Jog', 'run', 5234, 320, 4.2, 30),
('00000000-0000-0000-0000-000000000001', 'Evening Walk', 'walk', 3120, 180, 2.5, 25);
*/

-- Views for common queries

-- User statistics view
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
FROM users u
LEFT JOIN fitness_data fd ON fd.user_id = u.id
LEFT JOIN competition_participants cp ON cp.user_id = u.id
LEFT JOIN competitions c ON c.id = cp.competition_id
LEFT JOIN prizes p ON p.user_id = u.id AND p.status = 'distributed'
GROUP BY u.id, u.name, u.email;

-- Competition summary view
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
FROM competitions c
LEFT JOIN competition_participants cp ON cp.competition_id = c.id
LEFT JOIN fitness_data fd ON fd.competition_id = c.id
GROUP BY c.id, c.name, c.description, c.entry_fee, c.prize_pool, c.start_date, c.end_date, c.status, c.type, c.created_at;

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Competitions: Anyone can view, authenticated users can create
CREATE POLICY "Competitions are viewable by everyone" ON public.competitions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create competitions" ON public.competitions
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Competition participants: Users can view and join
CREATE POLICY "Participants viewable by everyone" ON public.competition_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join competitions" ON public.competition_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fitness data: Users can only view and insert their own data
CREATE POLICY "Users can view own fitness data" ON public.fitness_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fitness data" ON public.fitness_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity logs: Users can view and create their own
CREATE POLICY "Users can view own activity logs" ON public.activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard: Viewable by everyone
CREATE POLICY "Leaderboards are viewable by everyone" ON public.leaderboard_entries
    FOR SELECT USING (true);

-- Prizes: Viewable by everyone
CREATE POLICY "Prizes are viewable by everyone" ON public.prizes
    FOR SELECT USING (true);

-- Transactions: Users can only view their own
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE users IS 'User profile information extending Supabase Auth';
COMMENT ON TABLE competitions IS 'Fitness competitions with entry fees and prize pools';
COMMENT ON TABLE competition_participants IS 'Junction table for user competition participation';
COMMENT ON TABLE fitness_data IS 'Daily fitness tracking data from mobile apps';
COMMENT ON TABLE activity_logs IS 'Individual activity sessions for display';
COMMENT ON TABLE leaderboard_entries IS 'Cached leaderboard rankings per competition';
COMMENT ON TABLE prizes IS 'Prize distribution records';
COMMENT ON TABLE transactions IS 'Financial transactions for entry fees and prizes';
