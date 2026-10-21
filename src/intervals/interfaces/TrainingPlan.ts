export interface TrainingPlan {
  weekStart: string;
  sessions: PlannedSession[];
}

export interface PlannedSession {
  date: string; // start_date_local from API
  title: string; // name from API
  durationMinutes: number; // moving_time / 60 from API

  objective: string; // description from API
  workout?: {
    type: string;
    description: string;
  };

  flexibility: 'fixed' | 'flexible' | 'optional';
}