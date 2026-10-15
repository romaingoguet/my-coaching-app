export interface TrainingPlan {
  weekStart: string;
  sessions: PlannedSession[];
}

interface PlannedSession {
  date: string;
  title: string;
  durationMinutes: number;

  objective: string;

  workout?: {
    type: string;
    description: string;
  };

  flexibility: 'fixed' | 'flexible' | 'optional';
}