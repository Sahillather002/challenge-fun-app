import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Competition, StepData, LeaderboardEntry } from '../types';

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

export const MockCompetitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(competitionReducer, {
    competitions: [],
    currentCompetition: null,
    leaderboard: [],
    userSteps: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Load mock competitions
    const timer = setTimeout(() => {
      const mockCompetitions: Competition[] = [
        {
          id: 'comp1',
          name: 'Summer Step Challenge',
          description: 'Compete with your colleagues to see who can walk the most steps this summer!',
          type: 'weekly',
          entryFee: 50,
          prizePool: 3000,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-07'),
          participants: ['user123', 'user456', 'user789'],
          status: 'active',
          createdBy: 'admin123',
          rules: [
            'Steps must be tracked daily',
            'Manual step entry is not allowed',
            'Competition runs for 7 days',
            'Top 3 winners receive prizes'
          ],
          prizes: {
            first: 1800,
            second: 900,
            third: 300,
          },
        },
        {
          id: 'comp2',
          name: 'Monthly Marathon',
          description: 'A month-long competition to build healthy habits and win amazing prizes!',
          type: 'monthly',
          entryFee: 50,
          prizePool: 5000,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-30'),
          participants: ['user123'],
          status: 'upcoming',
          createdBy: 'admin123',
          rules: [
            'Daily step tracking required',
            'Minimum 5000 steps per day to qualify',
            'Competition runs for 30 days',
            'Consistent participation rewarded'
          ],
          prizes: {
            first: 3000,
            second: 1500,
            third: 500,
          },
        },
      ];
      dispatch({ type: 'SET_COMPETITIONS', payload: mockCompetitions });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const createCompetition = async (competitionData: Partial<Competition>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCompetition: Competition = {
        id: Date.now().toString(),
        name: competitionData.name || '',
        description: competitionData.description || '',
        type: competitionData.type || 'weekly',
        entryFee: competitionData.entryFee || 50,
        prizePool: 0,
        startDate: competitionData.startDate || new Date(),
        endDate: competitionData.endDate || new Date(),
        participants: [],
        status: 'upcoming',
        createdBy: 'user123',
        rules: competitionData.rules || [],
        prizes: competitionData.prizes || { first: 60, second: 30, third: 10 },
      };

      dispatch({ type: 'SET_CURRENT_COMPETITION', payload: newCompetition });
      dispatch({ 
        type: 'SET_COMPETITIONS', 
        payload: [...state.competitions, newCompetition] 
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const joinCompetition = async (competitionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedCompetitions = state.competitions.map(comp =>
        comp.id === competitionId
          ? { ...comp, participants: [...comp.participants, 'user123'] }
          : comp
      );
      
      dispatch({ type: 'SET_COMPETITIONS', payload: updatedCompetitions });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateSteps = async (competitionId: string, steps: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const stepData: StepData = {
        userId: 'user123',
        competitionId,
        date: new Date().toISOString().split('T')[0],
        steps,
        timestamp: new Date(),
      };

      dispatch({ type: 'SET_USER_STEPS', payload: [...state.userSteps, stepData] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const getLeaderboard = async (competitionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock leaderboard data
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          userId: 'user456',
          userName: 'Alice Johnson',
          totalSteps: 85000,
          rank: 1,
          prize: 1800,
        },
        {
          userId: 'user789',
          userName: 'Bob Smith',
          totalSteps: 72000,
          rank: 2,
          prize: 900,
        },
        {
          userId: 'user123',
          userName: 'John Doe',
          totalSteps: 68000,
          rank: 3,
          prize: 300,
        },
        {
          userId: 'user321',
          userName: 'Carol White',
          totalSteps: 55000,
          rank: 4,
        },
        {
          userId: 'user654',
          userName: 'David Brown',
          totalSteps: 48000,
          rank: 5,
        },
      ];

      dispatch({ type: 'SET_LEADERBOARD', payload: mockLeaderboard });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const getUserSteps = async (competitionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user steps data
      const mockSteps: StepData[] = [
        {
          userId: 'user123',
          competitionId,
          date: '2024-06-01',
          steps: 8500,
          timestamp: new Date('2024-06-01'),
        },
        {
          userId: 'user123',
          competitionId,
          date: '2024-06-02',
          steps: 9200,
          timestamp: new Date('2024-06-02'),
        },
        {
          userId: 'user123',
          competitionId,
          date: '2024-06-03',
          steps: 7800,
          timestamp: new Date('2024-06-03'),
        },
      ];

      dispatch({ type: 'SET_USER_STEPS', payload: mockSteps });
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