import { z } from 'zod';

export const TrainingPlanSchema = z.object({
  weekStart: z.string(),

  sessions: z.array(
    z.object({
      date: z.string(),
      title: z.string(),
      objective: z.string(),
      durationMinutes: z.number().int().nonnegative(),
      intensity: z.enum([
        'recovery',
        'easy',
        'endurance',
        'tempo',
        'threshold',
        'vo2max',
      ]),
      description: z.string(),
    }),
  ),

  coachingNotes: z.array(z.string()),
});

export type TrainingPlan = z.infer<typeof TrainingPlanSchema>;