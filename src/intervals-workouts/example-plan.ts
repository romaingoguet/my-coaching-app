import { TrainingPlan } from "./training-plan.types.js";

export const examplePlan: TrainingPlan = {
  weekStart: '2026-10-12',
  sessions: [
    {
      date: '2026-10-13',
      title: 'Endurance avec travail au seuil',
      objective: 'Développer la puissance au seuil sans finir épuisé',
      environment: 'indoor',
      totalDurationMinutes: 60,
      steps: [
        {
          name: 'Échauffement progressif',
          durationMinutes: 15,
          powerTarget: { minPercent: 55, maxPercent: 70 },
          instructions: 'Rester facile et augmenter progressivement la puissance.',
        },
        {
          name: 'Intervalle au seuil',
          durationMinutes: 10,
          powerTarget: { minPercent: 95, maxPercent: 100 },
          instructions: 'Effort régulier, sans sprint.',
        },
        {
          name: 'Retour au calme',
          durationMinutes: 35,
          powerTarget: { minPercent: 50, maxPercent: 60 },
          instructions: 'Pédalage souple.',
        },
      ],
      coachingNotes: ['Réduire la cible si la fatigue est inhabituelle.'],
    },
  ],
  coachingNotes: [],
};
