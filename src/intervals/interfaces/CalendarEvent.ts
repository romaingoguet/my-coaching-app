export interface CalendarEvent {
  id: string;
  date: string;

  type:
  | 'workout'
  | 'race'
  | 'target'
  | 'note'
  | 'other';

  name?: string;
  description?: string;

  durationSeconds?: number;
}