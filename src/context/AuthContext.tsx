import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { firebaseHelpers } from '../utils/firebaseHelpers';
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
    const unsubscribe = firebaseHelpers.auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await firebaseHelpers.firestore.getDoc('users', firebaseUser.uid);
          if (userDoc.exists) {
            const userData = userDoc.data ? userDoc.data() : userDoc.data;
            dispatch({ type: 'SET_USER', payload: userData as User });
          }
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user data' });
        }
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await firebaseHelpers.auth.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const register = async (userData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { email, password, ...otherData } = userData;
      const userCredential = await firebaseHelpers.auth.createUserWithEmailAndPassword(email, password);
      
      const newUser: User = {
        id: userCredential.user.uid,
        email,
        ...otherData,
        totalSteps: 0,
        competitionsWon: 0,
        joinedDate: new Date(),
      };

      await firebaseHelpers.firestore.setDoc('users', newUser.id, newUser);
      dispatch({ type: 'SET_USER', payload: newUser });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseHelpers.auth.signOut();
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!state.user) return;
    
    try {
      await firebaseHelpers.firestore.updateDoc('users', state.user.id, userData);
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