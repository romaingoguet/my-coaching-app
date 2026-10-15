import { AthleteMetrics } from "../mappers/IntervalsIcuMapper.js";
import { Activity } from "./Activity.js";
import { CalendarEvent } from "./CalendarEvent.js";
import { TrainingPlan } from "./TrainingPlan.js";
import { Wellness } from "./Wellness.js";

export interface TrainingContext {
  date: string;
  actualWeekMondayDate: string;

  weekParity: 'odd' | 'even';

  weekDates: Record<string, string>;

  profile: string;
  trainingContext: string;
  availability: string;

  recentActivities: Activity[];
  recentWellness: Wellness[];
  athleteMetrics: AthleteMetrics;

  upcomingEvents?: CalendarEvent[];

  previousPlan?: TrainingPlan;
}