import React, { createContext, useContext, useReducer, useEffect } from 'react';
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

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Simulate checking for existing user session
    const timer = setTimeout(() => {
      const mockUser: User = {
        id: 'user123',
        name: 'John Doe',
        email: 'john.doe@company.com',
        company: 'Tech Corp',
        department: 'Engineering',
        totalSteps: 150000,
        competitions_won: 3,
        joined_date: new Date('2024-01-15'),
      };
      dispatch({ type: 'SET_USER', payload: mockUser });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock login logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'test@company.com' && password === 'password') {
        const mockUser: User = {
          id: 'user123',
          name: 'John Doe',
          email: email,
          company: 'Tech Corp',
          department: 'Engineering',
          totalSteps: 150000,
          competitions_won: 0,
          joined_date: new Date('2024-01-15'),
        };
        dispatch({ type: 'SET_USER', payload: mockUser });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const register = async (userData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock registration logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        company: userData.company,
        department: userData.department,
        totalSteps: 0,
        competitions_won: 0,
        joined_date: new Date(),
      };

      dispatch({ type: 'SET_USER', payload: newUser });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!state.user) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'SET_USER', payload: { ...state.user, ...userData } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};