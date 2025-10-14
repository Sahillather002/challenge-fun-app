import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';
import supabase, { supabaseHelpers } from '@/config/supabase';

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

export const SupabaseAuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch] = useReducer(supabaseAuthReducer, initialState);
  let loginTimeoutRef: number | undefined;

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
          // Get user data from database
          try {
            const userData = await supabaseHelpers.users.getById(session.user.id);
            if (isMounted) {
              console.log('✅ User data loaded from database');
              dispatch({ type: 'SET_USER', payload: userData as User });
            }
          } catch (dbError: any) {
            // If user doesn't exist in database, don't set error state
            // Just log and continue - this is expected for new users
            console.log('User not found in database, will create on first auth state change');
            if (isMounted) {
              dispatch({ type: 'SET_USER', payload: null });
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
    // This ensures loading state is cleared even if auth state listener doesn't fire
    const safetyTimeoutRef = setTimeout(() => {
      console.log('⏰ Safety timeout reached, clearing loading state');
      if (isMounted) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, 10000); // Increased from 3s to 10s to allow time for auth state handler

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Supabase auth state changed:', event, session?.user?.id || 'no user');

      if (session?.user && isMounted) {
        console.log('🔐 Handling authenticated user:', session.user.id);

        try {
          // First, let's get the current auth user data to ensure we have the latest info
          console.log('🔍 Getting current auth user data...');
          let currentAuthUser = session.user; // Use session data as fallback

          try {
            // Try to get fresh user data with timeout
            const getUserPromise = supabase.auth.getUser();
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('getUser timeout')), 5000)
            );

            const { data: authUser, error: authError } = await Promise.race([
              getUserPromise,
              timeoutPromise
            ]) as any;

            if (authError) {
              console.error('❌ Error getting auth user:', authError);
              console.log('🔄 Falling back to session user data');
            } else {
              currentAuthUser = authUser.user;
              console.log('✅ Got fresh auth user data');
            }
          } catch (getUserError) {
            console.error('❌ getUser failed or timed out:', getUserError);
            console.log('🔄 Using session user data as fallback');
          }

          console.log('🔍 Auth user data:', currentAuthUser?.email);

          // Get or create user data in public.users table
          let userData: User | null = null;

          try {
            console.log('🔍 Attempting to fetch user data for:', currentAuthUser.id);

            // Add timeout for database fetch
            const fetchUserPromise = supabaseHelpers.users.getById(currentAuthUser.id);
            const fetchTimeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Database fetch timeout')), 3000)
            );

            userData = await Promise.race([fetchUserPromise, fetchTimeoutPromise]) as User;
            console.log('✅ User found in database:', userData?.id);
          } catch (dbError: any) {
            console.log('❌ Database fetch failed or timed out:', dbError?.message);
            console.log('❌ Error code:', dbError?.code);

            // If user doesn't exist in public.users, create them
            if (dbError?.code === 'PGRST116' || dbError?.message?.includes('not found') || dbError?.message?.includes('timeout')) {
              console.log('👤 User not found in public.users, creating from auth.users data...');
            } else {
              console.log('🔄 Other error, still attempting creation...');
            }
          }

          if (!userData && currentAuthUser) {
            console.log('👤 Creating new user in public.users from auth.users data...');

            try {
              // Create user in public.users using auth.users data
              const newUser: User = {
                id: currentAuthUser.id,
                email: currentAuthUser.email || '',
                name: currentAuthUser.user_metadata?.name || currentAuthUser.email?.split('@')[0] || 'User',
                company: currentAuthUser.user_metadata?.company || '',
                department: currentAuthUser.user_metadata?.department || '',
                totalSteps: 0,
                competitions_won: 0,
                joined_date: new Date(),
              };

              console.log('📝 Creating user in database:', newUser);

              // Add timeout for user creation
              const createUserPromise = supabaseHelpers.users.create(newUser);
              const createTimeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('User creation timeout')), 5000)
              );

              userData = await Promise.race([createUserPromise, createTimeoutPromise]) as User;
              console.log('✅ User created successfully:', userData!.id);
            } catch (createError: any) {
              console.error('❌ Failed to create user:', createError);
              // Continue without user data - we'll create a fallback user object
            }
          }

          if (isMounted && currentAuthUser) {
            // Always create a user object, even if database operations fail
            const finalUser: User = userData || {
              id: currentAuthUser.id,
              email: currentAuthUser.email || '',
              name: currentAuthUser.user_metadata?.name || currentAuthUser.email?.split('@')[0] || 'User',
              company: currentAuthUser.user_metadata?.company || '',
              department: currentAuthUser.user_metadata?.department || '',
              totalSteps: 0,
              competitions_won: 0,
              joined_date: new Date(),
            };

            console.log('Setting user in auth context:', finalUser.id);
            dispatch({ type: 'SET_USER', payload: finalUser });

            // Clear the login timeout since auth state change happened
            if (loginTimeoutRef) {
              clearTimeout(loginTimeoutRef);
              loginTimeoutRef = undefined;
            }
          }
        } catch (error: any) {
          console.error('❌ Error handling authenticated user:', error);
          if (isMounted) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
          }
        }
      } else if (isMounted) {
        console.log('🚪 Handling non-authenticated state');
        dispatch({ type: 'SET_USER', payload: null });
        // Loading will be cleared by SET_USER action in reducer
      }
    });

    // Cleanup function to clear any pending timeouts
    return () => {
      isMounted = false;
      subscription.unsubscribe();

      // Clear any pending login timeout
      if (loginTimeoutRef) {
        clearTimeout(loginTimeoutRef);
        loginTimeoutRef = undefined;
      }

      // Clear safety timeout
      clearTimeout(safetyTimeoutRef);
    };
  }, []);

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

      // Set a timeout to clear loading state if auth state change doesn't happen
      // This prevents the UI from being stuck indefinitely
      loginTimeoutRef = setTimeout(() => {
        console.log('⏰ Login timeout reached, clearing loading state');
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 5000);

    } catch (error: any) {
      console.error('❌ Login process failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      if (loginTimeoutRef) {
        clearTimeout(loginTimeoutRef);
        loginTimeoutRef = undefined;
      }

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
        // Create user in public.users table
        const newUser: User = {
          id: data.user.id,
          email,
          name: name || data.user.user_metadata?.name || email.split('@')[0],
          company: company || data.user.user_metadata?.company || '',
          department: department || data.user.user_metadata?.department || '',
          totalSteps: 0,
          competitions_won: 0,
          joined_date: new Date(),
        };

        await supabaseHelpers.users.create(newUser);
        dispatch({ type: 'SET_USER', payload: newUser });
        console.log('✅ User registered and profile created successfully');
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
      if (error) throw error;
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error: any) {
      console.error('Logout error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Logout failed' });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    try {
      console.log('🔄 Attempting to update user profile for:', state.user.id);

      // Prepare data for public.users table (exclude computed fields but preserve existing email)
      const { id, joined_date, created_at, updated_at, ...publicUserData } = userData as any;

      // Preserve existing email if not explicitly provided in update
      if (!publicUserData.email && state.user?.email) {
        publicUserData.email = state.user.email;
      }

      // Update public.users table
      const updatedUser = await supabaseHelpers.users.update(state.user.id, publicUserData);
      console.log('✅ User profile updated in public.users');

      // Check if we need to sync profile data back to auth.users metadata
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
          // Don't throw here - public.users update succeeded, this is just metadata sync
        } else {
          console.log('✅ Auth metadata synced successfully');
        }
      }

      dispatch({ type: 'SET_USER', payload: updatedUser as User });
      return updatedUser;
    } catch (error: any) {
      console.error('❌ Update user error:', error);

      // If update fails, try to refresh user data from server
      try {
        console.log('🔄 Attempting to refresh user data after update failure');
        const refreshedUser = await supabaseHelpers.users.getById(state.user.id);
        if (refreshedUser) {
          console.log('✅ User data refreshed successfully');
          dispatch({ type: 'SET_USER', payload: refreshedUser as User });
          return refreshedUser;
        }
      } catch (refreshError) {
        console.error('❌ Failed to refresh user data:', refreshError);
      }

      // If all else fails, keep the current user state but log the error
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
      console.log('🔄 Force syncing user data between auth.users and public.users');

      // Get current auth user data
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      const currentAuthUser = authUser.user;
      let userData = await supabaseHelpers.users.getById(state.user.id);

      // Sync auth.users metadata from public.users
      const authMetadataUpdates: any = {};
      if (userData.name && (!currentAuthUser.user_metadata?.name || userData.name !== currentAuthUser.user_metadata.name)) {
        authMetadataUpdates.name = userData.name;
      }
      if (userData.company && (!currentAuthUser.user_metadata?.company || userData.company !== currentAuthUser.user_metadata.company)) {
        authMetadataUpdates.company = userData.company;
      }
      if (userData.department && (!currentAuthUser.user_metadata?.department || userData.department !== currentAuthUser.user_metadata.department)) {
        authMetadataUpdates.department = userData.department;
      }

      if (Object.keys(authMetadataUpdates).length > 0) {
        await supabase.auth.updateUser({
          data: { ...currentAuthUser.user_metadata, ...authMetadataUpdates }
        });
      }

      // Sync public.users from auth.users
      const publicUserUpdates: any = {};
      if (currentAuthUser.email && currentAuthUser.email !== userData.email) {
        publicUserUpdates.email = currentAuthUser.email;
      }
      if (currentAuthUser.user_metadata?.name !== userData.name) {
        publicUserUpdates.name = currentAuthUser.user_metadata?.name;
      }
      if (currentAuthUser.user_metadata?.company !== userData.company) {
        publicUserUpdates.company = currentAuthUser.user_metadata?.company;
      }
      if (currentAuthUser.user_metadata?.department !== userData.department) {
        publicUserUpdates.department = currentAuthUser.user_metadata?.department;
      }

      if (Object.keys(publicUserUpdates).length > 0) {
        userData = await supabaseHelpers.users.update(state.user.id, publicUserUpdates);
      }

      dispatch({ type: 'SET_USER', payload: userData as User });
      console.log('✅ User data synchronized successfully');
      return userData;
    } catch (error: any) {
      console.error('❌ Sync user data error:', error);
      throw new Error('Failed to sync user data');
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
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  return context;
};
