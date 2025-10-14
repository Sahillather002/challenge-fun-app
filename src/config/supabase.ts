import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

// Using environment variables from .env file (loaded by webpack in development)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here'

console.log('🔗 Initializing Supabase...')
console.log('Supabase URL configured:', supabaseUrl !== 'https://your-project-id.supabase.co')
console.log('Supabase Key configured:', supabaseAnonKey !== 'your-anon-key-here')

// Create Supabase client with auth and realtime
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Accept': 'application/json',
      'Prefer': 'return=representation'
    },
  },
})

// Helper functions for database operations
export const supabaseHelpers = {
  // User operations
  users: {
    async getById(id: string) {
      console.log('🔍 Executing database query for user:', id);

      try {
        // First check if user exists in public.users table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no rows found

        if (error) {
          console.error('❌ Database query error:', error);
          console.error('❌ Error code:', error.code);
          console.error('❌ Error details:', error.details);
          console.error('❌ Error message:', error.message);
          throw error;
        }

        if (!data) {
          console.log('🔍 User not found in public.users table:', id);
          return null;
        }

        console.log('✅ Found user data:', data?.id);
        return data;
      } catch (error: any) {
        console.error('❌ Database query failed for user:', id, error);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
        throw error;
      }
    },

    async create(userData: any) {
      console.log('📝 Creating user in database:', userData.id);
      console.log('📋 User data being sent:', JSON.stringify(userData, null, 2));

      // Validate required fields
      if (!userData.id || !userData.email || !userData.name) {
        console.error('❌ Missing required fields:', { id: !!userData.id, email: !!userData.email, name: !!userData.name });
        throw new Error('Missing required fields: id, email, or name');
      }

      // Add timeout to prevent hanging queries
      const queryPromise = supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database create timeout')), 5000)
      );

      try {
        const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
        console.log('✅ User created in database:', data?.id);

        if (error) {
          console.error('❌ Database create error:', error);
          console.error('❌ Error details:', JSON.stringify(error, null, 2));
          throw error;
        }

        return data;
      } catch (error: any) {
        console.error('❌ Database create failed for user:', userData.id, error);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
        throw error;
      }
    },

    async update(id: string, userData: any) {
      console.log('📝 Updating user in database:', id);
      console.log('📋 Update data being sent:', JSON.stringify(userData, null, 2));

      try {
        // First check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          // User doesn't exist, this is expected for new users
          console.log('🔍 User not found, this might be a new user');
        } else if (fetchError) {
          console.error('❌ Error checking if user exists:', fetchError);
          throw fetchError;
        }

        // Use upsert to handle both create and update cases
        const { data, error } = await supabase
          .from('users')
          .upsert({
            id,
            ...userData,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          console.error('❌ Database update error:', error);
          console.error('❌ Error details:', JSON.stringify(error, null, 2));
          throw error;
        }

        console.log('✅ User updated in database:', data?.id);
        return data;
      } catch (error: any) {
        console.error('❌ Database update failed for user:', id, error);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
        throw error;
      }
    },

    async getAll() {
      const { data, error } = await supabase
        .from('users')
        .select('*')

      if (error) throw error
      return data
    }
  },

  // Competition operations
  competitions: {
    async getAll() {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },

    async create(competitionData: any) {
      const { data, error } = await supabase
        .from('competitions')
        .insert(competitionData)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async update(id: string, competitionData: any) {
      const { data, error } = await supabase
        .from('competitions')
        .update(competitionData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async getByStatus(status: string) {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    async joinCompetition(competitionId: string, userId: string) {
      // Add user to participants array
      const { data: competition } = await supabase
        .from('competitions')
        .select('participants')
        .eq('id', competitionId)
        .single()

      if (competition && !competition.participants?.includes(userId)) {
        const updatedParticipants = [...(competition.participants || []), userId]
        const { data, error } = await supabase
          .from('competitions')
          .update({ participants: updatedParticipants })
          .eq('id', competitionId)
          .select()
          .single()

        if (error) throw error
        return data
      }
      return competition
    }
  },

  // Step data operations
  steps: {
    async getByUserAndCompetition(userId: string, competitionId: string) {
      const { data, error } = await supabase
        .from('steps')
        .select('*')
        .eq('user_id', userId)
        .eq('competition_id', competitionId)
        .order('date', { ascending: false })

      if (error) throw error
      return data
    },

    async create(stepData: any) {
      const { data, error } = await supabase
        .from('steps')
        .insert(stepData)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async update(id: string, stepData: any) {
      const { data, error } = await supabase
        .from('steps')
        .update(stepData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async getLeaderboard(competitionId: string) {
      // Get aggregated steps for leaderboard
      const { data, error } = await supabase
        .from('steps')
        .select(`
          user_id,
          steps,
          users!inner(name, email)
        `)
        .eq('competition_id', competitionId)

      if (error) throw error

      // Aggregate steps by user
      const aggregated = data.reduce((acc: any, curr: any) => {
        const userId = curr.user_id
        if (!acc[userId]) {
          acc[userId] = {
            userId,
            userName: curr.users.name,
            totalSteps: 0,
            steps: []
          }
        }
        acc[userId].totalSteps += curr.steps
        acc[userId].steps.push(curr.steps)
        return acc
      }, {})

      // Convert to array and sort by total steps
      const leaderboard = Object.values(aggregated)
        .sort((a: any, b: any) => b.totalSteps - a.totalSteps)
        .map((entry: any, index: number) => ({
          ...entry,
          rank: index + 1
        }))

      return leaderboard
    },

    async getUserTotalSteps(userId: string, competitionId: string) {
      const { data, error } = await supabase
        .from('steps')
        .select('steps')
        .eq('user_id', userId)
        .eq('competition_id', competitionId)

      if (error) throw error

      return data.reduce((total: number, step: any) => total + step.steps, 0)
    }
  },

  // Payment operations
  payments: {
    async getByUser(userId: string) {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })

      if (error) throw error
      return data
    },

    async create(paymentData: any) {
      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  // Reward operations
  rewards: {
    async getByUser(userId: string) {
      const { data, error } = await supabase
        .from('rewards')
        .select(`
          *,
          competitions(name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    async create(rewardData: any) {
      const { data, error } = await supabase
        .from('rewards')
        .insert(rewardData)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async claimReward(id: string) {
      const { data, error } = await supabase
        .from('rewards')
        .update({
          claimed: true,
          claimed_date: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async getUnclaimedByUser(userId: string) {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', userId)
        .eq('claimed', false)

      if (error) throw error
      return data
    }
  },

  // Storage operations (using Firebase Storage for now)
  storage: {
    // We'll keep using Firebase Storage for image uploads
    // You can migrate this to Supabase Storage later if needed
  }
}

console.log('✅ Supabase initialized successfully')

export default supabase
