import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { firebaseHelpers } from '../utils/firebaseHelpers';
import { Competition, StepData, LeaderboardEntry } from '../types';
import { Platform } from 'react-native';

interface CompetitionState {
  competitions: Competition[];
  currentCompetition: Competition | null;
  leaderboard: LeaderboardEntry[];
  userSteps: StepData[];
  loading: boolean;
  error: string | null;
}

interface CompetitionContextType extends CompetitionState {
  createCompetition: (competitionData: Partial<Competition>) => Promise<void>;
  joinCompetition: (competitionId: string, userId: string) => Promise<void>;
  updateSteps: (competitionId: string, userId: string, steps: number) => Promise<void>;
  getLeaderboard: (competitionId: string) => Promise<void>;
  getUserSteps: (competitionId: string) => Promise<void>;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

type CompetitionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_COMPETITIONS'; payload: Competition[] }
  | { type: 'SET_CURRENT_COMPETITION'; payload: Competition | null }
  | { type: 'SET_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'SET_USER_STEPS'; payload: StepData[] }
  | { type: 'SET_ERROR'; payload: string | null };

const competitionReducer = (state: CompetitionState, action: CompetitionAction): CompetitionState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_COMPETITIONS':
      return { ...state, competitions: action.payload, loading: false };
    case 'SET_CURRENT_COMPETITION':
      return { ...state, currentCompetition: action.payload };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'SET_USER_STEPS':
      return { ...state, userSteps: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const CompetitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(competitionReducer, {
    competitions: [],
    currentCompetition: null,
    leaderboard: [],
    userSteps: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = firebaseHelpers.firestore.onSnapshot('competitions', (snapshot: any) => {
      const competitions = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Competition[];
      dispatch({ type: 'SET_COMPETITIONS', payload: competitions });
    });
    return unsubscribe;
  }, []);

  const createCompetition = async (competitionData: Partial<Competition>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newCompetition: Competition = {
        id: '',
        name: competitionData.name || '',
        description: competitionData.description || '',
        type: competitionData.type || 'weekly',
        entryFee: competitionData.entryFee || 50,
        prizePool: 0,
        startDate: competitionData.startDate || new Date(),
        endDate: competitionData.endDate || new Date(),
        participants: [],
        status: 'upcoming',
        createdBy: competitionData.createdBy || '',
        rules: competitionData.rules || [],
        prizes: competitionData.prizes || { first: 60, second: 30, third: 10 },
      };


      const docRef = await firebaseHelpers.firestore.addDoc('competitions', newCompetition);
      dispatch({ type: 'SET_CURRENT_COMPETITION', payload: { ...newCompetition, id: docRef.id } });
    } catch (error: any) {
      console.error('Create competition error:', error);
    }


  };

  const joinCompetition = async (competitionId: string, userId: string) => {
    try {
      // Note: arrayUnion needs platform-specific handling
      const competitionDoc = await firebaseHelpers.firestore.getDoc('competitions', competitionId);
      const competition = competitionDoc.data();
      if (!competition) {
        throw new Error('Competition not found');
      }
      const participants = competition.participants || [];
      participants.push(userId);
      await firebaseHelpers.firestore.updateDoc('competitions', competitionId, { participants });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateSteps = async (competitionId: string, userId: string, steps: number) => {
    try {
      const stepData: StepData = {
        userId,
        competitionId,
        date: new Date().toISOString().split('T')[0],
        steps,
        timestamp: new Date(),
      };
      await firebaseHelpers.firestore.addDoc('steps', stepData);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const getLeaderboard = async (competitionId: string) => {
    try {
      const q = firebaseHelpers.firestore.query('steps', { type: 'where', field: 'competitionId', operator: '==', value: competitionId });
      const snapshot = await firebaseHelpers.firestore.getDocs(q);
      const stepsData = snapshot.docs.map((doc: any) => doc.data() as StepData);


      const userSteps = new Map<string, number>();
      stepsData.forEach(s => userSteps.set(s.userId, (userSteps.get(s.userId) || 0) + s.steps));

      const leaderboard = Array.from(userSteps.entries())
        .map(([userId, totalSteps]) => ({ userId, totalSteps }))
        .sort((a, b) => b.totalSteps - a.totalSteps)
        .map((entry, i) => ({ ...entry, rank: i + 1, userName: `User ${entry.userId}` }));

      dispatch({ type: 'SET_LEADERBOARD', payload: leaderboard });
    } catch (error: any) {
      console.error('Leaderboard error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load leaderboard' });
    }


  };

  const getUserSteps = async (competitionId: string) => {
    try {
      const q = firebaseHelpers.firestore.query('steps', { type: 'where', field: 'competitionId', operator: '==', value: competitionId });
      const snapshot = await firebaseHelpers.firestore.getDocs(q);
      const stepsData = snapshot.docs.map((doc: any) => doc.data() as StepData);
      dispatch({ type: 'SET_USER_STEPS', payload: stepsData });
    } catch (error: any) {
      console.error('Get user steps error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load user steps' });
    }
  };

  return (
    <CompetitionContext.Provider
      value={{
        ...state,
        createCompetition,
        joinCompetition,
        updateSteps,
        getLeaderboard,
        getUserSteps,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (!context) throw new Error('useCompetition must be used within a CompetitionProvider');
  return context;
};
