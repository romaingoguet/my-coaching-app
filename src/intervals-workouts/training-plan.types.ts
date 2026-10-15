import { z } from 'zod';

export const WorkoutStepSchema = z.object({
  name: z.string().min(1),
  durationMinutes: z.number().positive(),
  powerTarget: z.object({
    minPercent: z.number().positive().max(250),
    maxPercent: z.number().positive().max(250),
  }).refine((target) => target.minPercent <= target.maxPercent, {
    message: 'minPercent doit être inférieur ou égal à maxPercent',
  }).optional(),
  instructions: z.string(),
});

export const WorkoutSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date attendue au format YYYY-MM-DD'),
  title: z.string().min(1),
  objective: z.string().min(1),
  environment: z.enum(['indoor', 'outdoor', 'either']),
  totalDurationMinutes: z.number().positive(),
  steps: z.array(WorkoutStepSchema).min(1),
  coachingNotes: z.array(z.string()).default([]),
});

export const TrainingPlanSchema = z.object({
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sessions: z.array(WorkoutSchema),
  coachingNotes: z.array(z.string()).default([]),
});

export type WorkoutStep = z.infer<typeof WorkoutStepSchema>;
export type Workout = z.infer<typeof WorkoutSchema>;
export type TrainingPlan = z.infer<typeof TrainingPlanSchema>;
