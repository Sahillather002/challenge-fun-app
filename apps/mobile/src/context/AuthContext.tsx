import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { firebaseHelpers } from '../utils/firebaseHelpers';
import { databaseHelpers } from '../utils/firebaseHelpers';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = firebaseHelpers.auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (!firebaseUser) {
        dispatch({ type: 'SET_USER', payload: null });
        return;
      }

      try {
        // Try to get user from Supabase first
        let userData = await databaseHelpers.users.getById(firebaseUser.uid);

        if (!userData) {
          // If user doesn't exist in Supabase, create from Firebase auth data
          const basicUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            company: '',
            department: '',
            totalSteps: 0,
            competitions_won: 0,
            joined_date: new Date(),
          };

          try {
            userData = await databaseHelpers.users.create(basicUser);
          } catch (createError) {
            console.warn('Could not create user in Supabase, using basic user:', createError);
            userData = basicUser;
          }
        }

        dispatch({ type: 'SET_USER', payload: userData as User });
      } catch (error: any) {
        console.error('Failed to fetch user data:', error);

        // If offline or connection error, create a basic user from auth data
        if (error.code === 'unavailable' || error.message?.includes('offline')) {
          const basicUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            company: '',
            department: '',
            totalSteps: 0,
            competitions_won: 0,
            joined_date: new Date(),
          };
          dispatch({ type: 'SET_USER', payload: basicUser });
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user data' });
        }
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await firebaseHelpers.auth.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Login failed';
      
      if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please register first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
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
      const { email, password, ...otherData } = userData;
      const userCredential = await firebaseHelpers.auth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      const newUser: User = {
        id: uid,
        email,
        ...otherData,
        totalSteps: 0,
        competitions_won: 0,
        joined_date: new Date(),
      };

      // Create user in Supabase
      await databaseHelpers.users.create(newUser);
      dispatch({ type: 'SET_USER', payload: newUser });
    } catch (error: any) {
      console.error('Registration error:', error);

      // Provide user-friendly error messages
      let errorMessage = 'Registration failed';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await firebaseHelpers.auth.signOut();
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
      const updatedUser = await databaseHelpers.users.update(state.user.id, userData);
      dispatch({ type: 'SET_USER', payload: updatedUser as User });
    } catch (error: any) {
      console.error('Update user error:', error);
      const errorMessage = error.message || 'Failed to update profile';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
