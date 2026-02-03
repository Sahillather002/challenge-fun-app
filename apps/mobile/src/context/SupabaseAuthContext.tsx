import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';
import { supabase, supabaseHelpers } from '../config/supabase';

interface SupabaseAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface SupabaseAuthContextType extends SupabaseAuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<User>;
  syncUserData: () => Promise<User>;
  makeUserAdmin: (userId: string) => Promise<any>;
  syncAllAuthUsers: () => Promise<{ syncedCount: number; errorCount: number }>;
}

type SupabaseAuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: SupabaseAuthState = {
  user: null,
  loading: true,
  error: null,
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

const supabaseAuthReducer = (state: SupabaseAuthState, action: SupabaseAuthAction): SupabaseAuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(supabaseAuthReducer, initialState);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const getSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user && isMounted) {
          console.log('✅ Found existing session for user:', session.user.id);
          // Get user profile from database
          try {
            const profile = await supabaseHelpers.userProfiles.getById(session.user.id);
            if (isMounted && profile) {
              console.log('✅ User profile loaded from database');
              dispatch({ type: 'SET_USER', payload: profile as User });
              dispatch({ type: 'SET_ERROR', payload: null }); // Clear any previous errors
            } else {
              // Create profile for existing user
              const newProfile = await createUserProfile(session.user);
              if (isMounted) {
                dispatch({ type: 'SET_USER', payload: newProfile });
                dispatch({ type: 'SET_ERROR', payload: null }); // Clear any previous errors
              }
            }
          } catch (dbError: any) {
            console.error('❌ Error loading user profile:', dbError);
            if (isMounted) {
              dispatch({ type: 'SET_ERROR', payload: 'Failed to load user profile' });
            }
          }
        } else {
          console.log('❌ No existing session found');
          if (isMounted) {
            dispatch({ type: 'SET_USER', payload: null });
          }
        }
      } catch (error: any) {
        console.error('❌ Error getting session:', error);
        if (isMounted) {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to get session' });
        }
      }
    };

    getSession();

    // Safety timeout to prevent infinite loading state
    const safetyTimeoutRef = setTimeout(() => {
      console.log('⏰ Safety timeout reached, clearing loading state');
      if (isMounted) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, 10000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Supabase auth state changed:', event, session?.user?.id || 'no user');

      if (session?.user && isMounted) {
        console.log('🔐 Handling authenticated user:', session.user.id);

        try {
          // Create or get user profile data (but don't rely on it for auth)
          console.log('🔍 Getting user profile data for:', session.user.id);

          // Try to get existing profile
          let profile = await supabaseHelpers.userProfiles.getById(session.user.id);

          if (!profile) {
            console.log('👤 Creating new user profile...');
            profile = await createUserProfile(session.user);
          }

          if (isMounted && profile) {
            console.log('✅ User profile loaded, setting auth state');
            dispatch({ type: 'SET_USER', payload: profile as User });
            dispatch({ type: 'SET_ERROR', payload: null }); // Clear any previous errors
          } else if (isMounted) {
            // If no profile data, create a basic user object from auth data
            console.log('📋 Using auth user data as fallback');
            const fallbackUser: User = {
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              company: session.user.user_metadata?.company || '',
              department: session.user.user_metadata?.department || '',
              totalSteps: 0,
              competitions_won: 0,
              joined_date: new Date(),
              role: 'user',
            };
            dispatch({ type: 'SET_USER', payload: fallbackUser });
            dispatch({ type: 'SET_ERROR', payload: null }); // Clear any previous errors
          }
        } catch (error: any) {
          console.error('❌ Error loading user profile:', error);
          if (isMounted) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load user profile' });
          }
        }
      } else if (isMounted) {
        console.log('🚪 Handling non-authenticated state');
        dispatch({ type: 'SET_USER', payload: null });
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeoutRef);
    };
  }, []);

  const createUserProfile = async (authUser: any): Promise<User> => {
    const profileData = {
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
      company: authUser.user_metadata?.company || '',
      department: authUser.user_metadata?.department || '',
      total_steps: 0,
      competitions_won: 0,
      joined_date: new Date(),
      role: 'user',
    };

    return await supabaseHelpers.userProfiles.create(profileData);
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      console.log('🔐 Starting Supabase login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Supabase login error:', error);
        throw error;
      }

      console.log('✅ Supabase login successful, waiting for auth state change...');

      // The auth state change handler will set the user data
      // Set a timeout to clear loading state if auth state change doesn't happen
      setTimeout(() => {
        console.log('⏰ Login timeout reached, clearing loading state');
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 5000);

    } catch (error: any) {
      console.error('❌ Login process failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });

      let errorMessage = 'Login failed';
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please confirm your email address';
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { email, password, name, company, department, ...otherData } = userData;

      // Prepare metadata for auth.users
      const metadata = {
        name,
        company,
        department,
        ...otherData
      };

      // Create auth user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile in user_profiles table
        const profileData = {
          id: data.user.id,
          name: name || data.user.user_metadata?.name || email.split('@')[0],
          email: email,
          company: company || data.user.user_metadata?.company || '',
          department: department || data.user.user_metadata?.department || '',
          total_steps: 0,
          competitions_won: 0,
          joined_date: new Date(),
          role: 'user',
        };

        try {
          const profile = await supabaseHelpers.userProfiles.create(profileData);
          dispatch({ type: 'SET_USER', payload: profile as User });
          dispatch({ type: 'SET_ERROR', payload: null }); // Clear any previous errors
          console.log('✅ User registered and profile created successfully');
        } catch (dbError: any) {
          console.error('❌ Database creation failed, using fallback profile object:', dbError);

          // If database creation fails, create a fallback profile object for now
          const fallbackProfile: User = {
            id: profileData.id,
            name: profileData.name,
            email: profileData.email,
            company: profileData.company,
            department: profileData.department,
            totalSteps: profileData.total_steps,
            competitions_won: profileData.competitions_won,
            joined_date: profileData.joined_date,
            role: 'user' as const
          };

          dispatch({ type: 'SET_USER', payload: fallbackProfile });
          dispatch({ type: 'SET_ERROR', payload: 'Account created but profile sync failed. Please contact support if issues persist.' });

          console.log('✅ User registered with fallback profile - database sync needed');
        }
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });

      let errorMessage = 'Registration failed';
      if (error.message?.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address';
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error: any) {
      console.error('Logout error:', error);
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Logout failed' });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    try {
      console.log('🔄 Attempting to update user profile for:', state.user.id);

      // Update user_profiles table
      const updatedProfile = await supabaseHelpers.userProfiles.update(state.user.id, userData);
      console.log('✅ User profile updated in user_profiles');

      // Update auth.users metadata if there are name/company/department changes
      const authMetadataToUpdate: any = {};

      if (userData.name && userData.name !== state.user.name) {
        authMetadataToUpdate.name = userData.name;
      }
      if (userData.company && userData.company !== state.user.company) {
        authMetadataToUpdate.company = userData.company;
      }
      if (userData.department && userData.department !== state.user.department) {
        authMetadataToUpdate.department = userData.department;
      }

      // Update auth.users metadata if there are changes
      if (Object.keys(authMetadataToUpdate).length > 0) {
        console.log('🔄 Syncing profile changes back to auth.users metadata');
        const { error: authUpdateError } = await supabase.auth.updateUser({
          data: {
            ...state.user, // Keep existing metadata
            ...authMetadataToUpdate // Add new metadata
          }
        });

        if (authUpdateError) {
          console.error('❌ Failed to update auth metadata:', authUpdateError);
        } else {
          console.log('✅ Auth metadata synced successfully');
        }
      }

      dispatch({ type: 'SET_USER', payload: updatedProfile as User });
      return updatedProfile;
    } catch (error: any) {
      console.error('❌ Update user error:', error);

      // If update fails, try to refresh user data from server
      try {
        console.log('🔄 Attempting to refresh user data after update failure');
        const refreshedProfile = await supabaseHelpers.userProfiles.getById(state.user.id);
        if (refreshedProfile) {
          console.log('✅ User data refreshed successfully');
          dispatch({ type: 'SET_USER', payload: refreshedProfile as User });
          return refreshedProfile;
        }
      } catch (refreshError) {
        console.error('❌ Failed to refresh user data:', refreshError);
      }

      console.error('❌ Profile update failed, maintaining current user state');
      const errorMessage = error.message || 'Failed to update profile';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const syncUserData = async () => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    try {
      console.log('🔄 Force syncing user data between auth.users and user_profiles');

      // Get current auth user data
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      const currentAuthUser = authUser.user;
      let profile = await supabaseHelpers.userProfiles.getById(state.user.id);

      if (!profile) {
        console.log('👤 Profile not found, creating from auth data...');
        profile = await createUserProfile(currentAuthUser);
      } else {
        // Sync auth.users metadata to user_profiles
        const profileUpdates: any = {};

        if (currentAuthUser.user_metadata?.name !== profile.name) {
          profileUpdates.name = currentAuthUser.user_metadata?.name;
        }
        if (currentAuthUser.user_metadata?.company !== profile.company) {
          profileUpdates.company = currentAuthUser.user_metadata?.company;
        }
        if (currentAuthUser.user_metadata?.department !== profile.department) {
          profileUpdates.department = currentAuthUser.user_metadata?.department;
        }

        if (Object.keys(profileUpdates).length > 0) {
          profile = await supabaseHelpers.userProfiles.update(state.user.id, profileUpdates);
        }
      }

      dispatch({ type: 'SET_USER', payload: profile as User });
      console.log('✅ User data synchronized successfully');
      return profile;
    } catch (error: any) {
      console.error('❌ Sync user data error:', error);
      throw new Error('Failed to sync user data');
    }
  };

  const makeUserAdmin = async (userId: string) => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    try {
      console.log('👑 Making user admin:', userId);

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role: 'admin', updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ User role updated to admin:', data.id);

      // If updating current user, refresh their data
      if (userId === state.user.id) {
        const refreshedProfile = await supabaseHelpers.userProfiles.getById(userId);
        if (refreshedProfile) {
          dispatch({ type: 'SET_USER', payload: refreshedProfile as User });
        }
      }

      return data;
    } catch (error: any) {
      console.error('❌ Failed to make user admin:', error);
      throw new Error('Failed to update user role');
    }
  };

  const syncAllAuthUsers = async () => {
    try {
      console.log('🔄 Syncing all auth users to user_profiles...');

      // Get all auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      let syncedCount = 0;
      let errorCount = 0;

      for (const authUser of authUsers.users) {
        try {
          // Check if profile exists in user_profiles
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', authUser.id)
            .single();

          if (!existingProfile) {
            // Create profile in user_profiles
            const { error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: authUser.id,
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                company: authUser.user_metadata?.company || '',
                department: authUser.user_metadata?.department || '',
                total_steps: 0,
                competitions_won: 0,
                joined_date: new Date().toISOString(),
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (createError) throw createError;
            syncedCount++;
            console.log('✅ Synced user:', authUser.email);
          }
        } catch (userError: any) {
          console.error('❌ Failed to sync user:', authUser.email, userError);
          errorCount++;
        }
      }

      console.log(`✅ Sync complete: ${syncedCount} users synced, ${errorCount} errors`);
      return { syncedCount, errorCount };
    } catch (error: any) {
      console.error('❌ Failed to sync auth users:', error);
      throw new Error('Failed to sync users');
    }
  };

  return (
    <SupabaseAuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        syncUserData,
        makeUserAdmin,
        syncAllAuthUsers,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = (): SupabaseAuthContextType => {
  const context = useContext(SupabaseAuthContext);
  if (!context) throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  return context;
};
