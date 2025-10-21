// Step tracker utilities
export interface StepData {
  steps: number;
  distance: number;
  calories: number;
  timestamp: Date;
}

export class StepTracker {
  private steps: number = 0;
  private startTime: Date | null = null;

  start(): void {
    this.startTime = new Date();
    this.steps = 0;
  }

  stop(): StepData {
    const endTime = new Date();
    const duration = this.startTime 
      ? (endTime.getTime() - this.startTime.getTime()) / 1000 / 60 
      : 0;

    return {
      steps: this.steps,
      distance: this.steps * 0.0005, // Approximate: 1 step = 0.5 meters
      calories: this.steps * 0.04, // Approximate: 1 step = 0.04 calories
      timestamp: endTime,
    };
  }

  addSteps(count: number): void {
    this.steps += count;
  }

  getSteps(): number {
    return this.steps;
  }
}

export function calculateDistance(steps: number): number {
  return steps * 0.0005; // km
}

export function calculateCalories(steps: number): number {
  return steps * 0.04;
}
