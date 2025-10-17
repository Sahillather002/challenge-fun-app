import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

// Using environment variables from .env file (loaded by webpack in development)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here'

console.log('🔗 Initializing Supabase...')
console.log('Supabase URL configured:', supabaseUrl !== 'https://your-project-id.supabase.co')
console.log('Supabase Key configured:', supabaseAnonKey !== 'your-anon-key-here')

// Helper function to convert camelCase to snake_case for database fields
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Helper function to convert object keys from camelCase to snake_case
const convertKeysToSnakeCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToSnakeCase);

  const converted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    converted[camelToSnake(key)] = convertKeysToSnakeCase(value);
  }
  return converted;
};

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
  // User Profiles operations (new schema)
  userProfiles: {
    async getById(id: string) {
      console.log('🔍 Executing database query for user profile:', id);

      try {
        // Add timeout to prevent hanging queries
        const queryPromise = supabase
          .from('user_profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000)
        );

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

        if (error) {
          console.error('❌ Database query error:', error);
          throw error;
        }

        if (!data) {
          console.log('🔍 User profile not found in user_profiles table:', id);
          return null;
        }

        console.log('✅ Found user profile:', data?.id);
        return data;
      } catch (error: any) {
        console.error('❌ Database query failed for user profile:', id, error);
        if (error.message === 'Query timeout after 10 seconds') {
          console.error('🚨 Query timed out - possible network or database issue');
        }
        throw error;
      }
    },

    async create(profileData: any) {
      console.log('📝 Creating user profile in database:', profileData.id);

      // Validate required fields
      if (!profileData.id || !profileData.name) {
        throw new Error('Missing required fields: id or name');
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .insert(profileData)
          .select()
          .single();

        if (error) {
          console.error('❌ Database create error:', error);
          throw error;
        }

        console.log('✅ User profile created in database:', data?.id);
        return data;
      } catch (error: any) {
        console.error('❌ Database create failed for user profile:', profileData.id, error);
        throw error;
      }
    },

    async update(id: string, profileData: any) {
      console.log('📝 Updating user profile in database:', id);

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .update({
            ...convertKeysToSnakeCase(profileData),
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('❌ Database update error:', error);
          throw error;
        }

        console.log('✅ User profile updated in database:', data?.id);
        return data;
      } catch (error: any) {
        console.error('❌ Database update failed for user profile:', id, error);
        throw error;
      }
    },

    async getAll() {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');

      if (error) throw error;
      return data;
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
    },

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
      // Get steps data for the competition
      const { data: stepsData, error: stepsError } = await supabase
        .from('steps')
        .select('user_id, steps')
        .eq('competition_id', competitionId)

      if (stepsError) throw stepsError

      if (!stepsData || stepsData.length === 0) {
        return []
      }

      // Get unique user IDs
      const userIds = [...new Set(stepsData.map(step => step.user_id))]

      // Get user profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, name, email')
        .in('id', userIds)

      if (profilesError) throw profilesError

      // Create a map of user profiles for quick lookup
      const profilesMap = new Map(profilesData?.map(profile => [profile.id, profile]) || [])

      // Aggregate steps by user
      const aggregated = stepsData.reduce((acc: any, curr: any) => {
        const userId = curr.user_id
        const userProfile = profilesMap.get(userId)

        if (!acc[userId]) {
          acc[userId] = {
            userId,
            userName: userProfile?.name || 'Unknown User',
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

  // Diagnostic function to test database connectivity and RLS policies
  async testDatabaseConnection() {
    console.log('🔍 Testing database connectivity and RLS policies...');

    try {
      // Test 1: Try to query user_profiles table (should work if RLS allows)
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);

      if (profilesError) {
        console.error('❌ User profiles table query failed:', profilesError);
      } else {
        console.log('✅ User profiles table query successful');
      }

      // Test 2: Try to insert a test record (for debugging RLS)
      const testUserId = 'test-connection-' + Date.now();
      const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: testUserId,
          name: 'Test User',
          role: 'user'
        })
        .select();

      if (insertError) {
        console.log('❌ Test insert failed (expected if not authenticated):', insertError.code, insertError.message);
      } else {
        console.log('✅ Test insert successful - RLS policies may need adjustment');
        // Clean up test record
        await supabase.from('user_profiles').delete().eq('id', testUserId);
      }

      return {
        profilesQuery: { success: !profilesError, error: profilesError },
        testInsert: { success: !insertError, error: insertError }
      };
    } catch (error: any) {
      console.error('❌ Database connection test failed:', error);
      return { error };
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
