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
  joinCompetition: (competitionId: string) => Promise<void>;
  updateSteps: (competitionId: string, steps: number) => Promise<void>;
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
    const unsubscribe = firebaseHelpers.firestore.onSnapshot('competitions', (snapshot) => {
      const competitions = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...(doc.data ? doc.data() : doc.data),
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
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const joinCompetition = async (competitionId: string) => {
    try {
      // Note: arrayUnion needs platform-specific handling
      const competitionDoc = await firebaseHelpers.firestore.getDoc('competitions', competitionId);
      const competition = competitionDoc.data ? competitionDoc.data() : competitionDoc.data;
      const participants = competition.participants || [];
      participants.push(competitionId);
      await firebaseHelpers.firestore.updateDoc('competitions', competitionId, { participants });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateSteps = async (competitionId: string, steps: number) => {
    try {
      const stepData: StepData = {
        userId: '', // This would come from auth context
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
      let stepsSnapshot;
      if (Platform.OS === 'web') {
        const { query, where, getDocs, collection } = require('firebase/firestore');
        const { firestore } = require('../config/firebase');
        const stepsRef = collection(firestore, 'steps');
        const q = query(stepsRef, where('competitionId', '==', competitionId));
        stepsSnapshot = await getDocs(q);
      } else {
        const { firestore } = require('../config/firebase');
        stepsSnapshot = await firestore().collection('steps').where('competitionId', '==', competitionId).get();
      }

      const stepsData = stepsSnapshot.docs.map((doc: any) => (doc.data ? doc.data() : doc.data) as StepData);
      
      // Aggregate steps by user
      const userStepsMap = new Map<string, number>();
      stepsData.forEach(step => {
        const currentSteps = userStepsMap.get(step.userId) || 0;
        userStepsMap.set(step.userId, currentSteps + step.steps);
      });

      // Convert to leaderboard entries
      const leaderboard: LeaderboardEntry[] = Array.from(userStepsMap.entries())
        .map(([userId, totalSteps], index) => ({
          userId,
          userName: `User ${userId}`, // This would fetch actual user names
          totalSteps,
          rank: index + 1,
        }))
        .sort((a, b) => b.totalSteps - a.totalSteps)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      dispatch({ type: 'SET_LEADERBOARD', payload: leaderboard });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const getUserSteps = async (competitionId: string) => {
    try {
      let stepsSnapshot;
      if (Platform.OS === 'web') {
        const { query, where, getDocs, collection } = require('firebase/firestore');
        const { firestore } = require('../config/firebase');
        const stepsRef = collection(firestore, 'steps');
        const q = query(stepsRef, where('competitionId', '==', competitionId));
        stepsSnapshot = await getDocs(q);
      } else {
        const { firestore } = require('../config/firebase');
        stepsSnapshot = await firestore().collection('steps').where('competitionId', '==', competitionId).get();
      }

      const stepsData = stepsSnapshot.docs.map((doc: any) => (doc.data ? doc.data() : doc.data) as StepData);
      dispatch({ type: 'SET_USER_STEPS', payload: stepsData });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
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
  if (context === undefined) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
};