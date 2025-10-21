import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Competition, StepData, LeaderboardEntry } from '../types';
import { useSupabaseAuth } from './SupabaseAuthContext';
import { supabaseHelpers } from '@/config/supabase';

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
  refreshCompetitions: () => Promise<void>;
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

  const { user } = useSupabaseAuth();

  useEffect(() => {
    refreshCompetitions();
  }, []);

  const refreshCompetitions = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const competitions = await supabaseHelpers.competitions.getAll();

      // Update competition statuses based on dates
      const now = new Date();
      const updatedCompetitions = competitions.map((competition: Competition) => {
        const startDate = new Date(competition.start_date);
        const endDate = new Date(competition.end_date);

        let newStatus = competition.status;

        if (now < startDate && competition.status !== 'upcoming') {
          newStatus = 'upcoming';
        } else if (now >= startDate && now <= endDate && competition.status !== 'active') {
          newStatus = 'active';
        } else if (now > endDate && competition.status !== 'completed') {
          newStatus = 'completed';
        }

        // Update in database if status changed
        if (newStatus !== competition.status) {
          supabaseHelpers.competitions.update(competition.id, {
            status: newStatus,
            updated_at: new Date().toISOString()
          }).catch(error => console.error('Error updating competition status:', error));
        }

        return { ...competition, status: newStatus };
      });

      dispatch({ type: 'SET_COMPETITIONS', payload: updatedCompetitions });
    } catch (error: any) {
      console.error('Error loading competitions:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load competitions' });
    }
  };

  const createCompetition = async (competitionData: Partial<Competition>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const newCompetition = {
        ...competitionData,
        created_by: user.id,
        participants: [],
        status: 'upcoming' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const createdCompetition = await supabaseHelpers.competitions.create(newCompetition);

      // Update local state
      dispatch({
        type: 'SET_COMPETITIONS',
        payload: [...state.competitions, createdCompetition]
      });
      dispatch({ type: 'SET_CURRENT_COMPETITION', payload: createdCompetition });

    } catch (error: any) {
      console.error('Error creating competition:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const joinCompetition = async (competitionId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      await supabaseHelpers.competitions.joinCompetition(competitionId, user.id);
      await refreshCompetitions(); // Refresh to get updated participants
    } catch (error: any) {
      console.error('Error joining competition:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateSteps = async (competitionId: string, steps: number) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const stepData = {
        user_id: user.id,
        competition_id: competitionId,
        steps,
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
      };

      await supabaseHelpers.steps.create(stepData);

      // Refresh user steps for this competition
      await getUserSteps(competitionId);

    } catch (error: any) {
      console.error('Error updating steps:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const getLeaderboard = async (competitionId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const leaderboard = await supabaseHelpers.steps.getLeaderboard(competitionId);
      dispatch({ type: 'SET_LEADERBOARD', payload: leaderboard });
    } catch (error: any) {
      console.error('Error loading leaderboard:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const getUserSteps = async (competitionId: string) => {
    if (!user) return;

    try {
      const userSteps = await supabaseHelpers.steps.getByUserAndCompetition(user.id, competitionId);
      dispatch({ type: 'SET_USER_STEPS', payload: userSteps });
    } catch (error: any) {
      console.error('Error loading user steps:', error);
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
        refreshCompetitions,
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