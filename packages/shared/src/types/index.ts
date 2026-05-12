// Activity types
export interface Activity {
  id: string;
  userId: string;
  competitionId?: string;
  steps: number;
  distance: number;
  calories: number;
  activeMinutes: number;
  date: Date;
}
