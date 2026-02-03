// Mock Supabase for web development to bypass import issues
// This provides the same interface without requiring actual Supabase packages

const mockSupabaseClient = {
  auth: {
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
    signInWithPassword: async ({ email, password }: any) => {
      console.log('Mock login:', email);
      return { data: { user: { id: '1', email } }, error: null };
    },
    signUp: async ({ email, password }: any) => {
      console.log('Mock signup:', email);
      return { data: { user: { id: '1', email } }, error: null };
    },
    signOut: async () => {
      console.log('Mock logout');
      return { error: null };
    },
    getUser: async () => {
      return { data: { user: { id: '1', email: 'test@example.com' } }, error: null };
    },
    onAuthStateChange: (callback: any) => {
      callback('SIGNED_IN', { user: { id: '1', email: 'test@example.com' } });
      return { data: { subscription: { unsubscribe: () => { } } } };
    }
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        data: [],
        error: null
      })
    }),
    insert: () => ({
      data: [],
      error: null
    }),
    update: () => ({
      eq: () => ({
        data: [],
        error: null
      })
    }),
    delete: () => ({
      eq: () => ({
        data: [],
        error: null
      })
    })
  })
};

export const supabase = mockSupabaseClient;
export const supabaseHelpers = {
  uploadFile: async (file: File) => ({ url: '', error: null }),
  downloadFile: async (path: string) => ({ data: null, error: null }),
  deleteFile: async (path: string) => ({ error: null }),

  userProfiles: {
    getById: async (id: string) => ({
      id,
      name: 'Forest Guardian',
      email: 'guardian@forest.com',
      company: 'Earth First',
      department: 'Conservation',
      totalSteps: 15420,
      competitions_won: 3,
      joined_date: new Date(),
      role: 'user'
    }),
    create: async (data: any) => data,
    update: async (id: string, data: any) => ({ id, ...data }),
  },

  competitions: {
    getAll: async () => [
      {
        id: 'c1',
        title: 'Emerald Valley Trek',
        description: 'A 7-day hike through the virtual emerald valley.',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 604800000).toISOString(),
        status: 'active',
        participants: ['1', '2', '3'],
        entry_fee: 50,
        prize_pool: 500,
        type: 'steps'
      },
      {
        id: 'c2',
        title: 'Morning Dew Sprint',
        description: 'Quick morning competition to start your day.',
        start_date: new Date(Date.now() + 86400000).toISOString(),
        end_date: new Date(Date.now() + 172800000).toISOString(),
        status: 'upcoming',
        participants: ['1'],
        entry_fee: 10,
        prize_pool: 100,
        type: 'steps'
      }
    ],
    create: async (data: any) => ({ ...data, id: Math.random().toString() }),
    update: async (id: string, data: any) => ({ id, ...data }),
    joinCompetition: async (compId: string, userId: string) => ({ compId, userId }),
  },

  steps: {
    create: async (data: any) => data,
    getLeaderboard: async (compId: string) => [
      { user_id: '1', user_name: 'Forest Guardian', steps: 8500, rank: 1 },
      { user_id: '2', user_name: 'Dew Walker', steps: 7200, rank: 2 },
      { user_id: '3', user_name: 'Leaf Runner', steps: 6100, rank: 3 }
    ],
    getByUserAndCompetition: async (userId: string, compId: string) => [
      { id: 's1', user_id: userId, competition_id: compId, steps: 1200, date: new Date().toISOString() }
    ]
  },
  rewards: {
    getByUser: async (userId: string) => [
      { id: 'r1', user_id: userId, competition_id: 'c1', amount: 50, position: 2 as 2, claimed: true, claimed_date: new Date(), created_at: new Date() },
      { id: 'r2', user_id: userId, competition_id: 'c2', amount: 100, position: 1 as 1, claimed: false, created_at: new Date() }
    ],
    claimReward: async (rewardId: string) => ({ id: rewardId, claimed: true })
  }
};
