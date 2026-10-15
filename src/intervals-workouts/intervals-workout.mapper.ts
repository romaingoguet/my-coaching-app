import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { TrainingPlan, Workout, WorkoutStep } from './training-plan.types.js';

export interface IntervalsWorkoutEvent {
  category: 'WORKOUT';
  start_date_local: string;
  name: string;
  type: 'Ride';
  indoor: boolean;
  description: string;
  external_id: string;
}

@Injectable()
export class IntervalsWorkoutMapper {
  toEvents(plan: TrainingPlan): IntervalsWorkoutEvent[] {
    return plan.sessions.map((workout) => this.toEvent(workout));
  }

  private toEvent(workout: Workout): IntervalsWorkoutEvent {
    this.assertDurationConsistency(workout);

    const description = [
      `Objectif : ${workout.objective}`,
      '',
      ...workout.steps.flatMap((step) => this.formatStep(step)),
      ...(workout.coachingNotes.length
        ? ['', 'Notes du coach', ...workout.coachingNotes.map((note) => `- ${note}`)]
        : []),
    ].join('\n');

    return {
      category: 'WORKOUT',
      // Intervals.icu utilise souvent une date locale à minuit pour un événement journalier.
      start_date_local: `${workout.date}T00:00:00`,
      name: workout.title,
      type: 'Ride',
      indoor: workout.environment === 'indoor',
      description,
      external_id: this.externalId(workout),
    };
  }

  private formatStep(step: WorkoutStep): string[] {
    const target = step.powerTarget
      ? ` ${step.powerTarget.minPercent}-${step.powerTarget.maxPercent}%`
      : '';

    const instruction = step.instructions.trim();
    return [
      step.name,
      `- ${this.formatDuration(step.durationMinutes)}${target}`,
      ...(instruction ? [instruction] : []),
      '',
    ];
  }

  private formatDuration(minutes: number): string {
    const totalSeconds = Math.round(minutes * 60);
    const wholeMinutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return seconds === 0 ? `${wholeMinutes}m` : `${wholeMinutes}m${seconds}s`;
  }

  private assertDurationConsistency(workout: Workout): void {
    const stepsTotal = workout.steps.reduce(
      (total, step) => total + step.durationMinutes,
      0,
    );
    if (Math.abs(stepsTotal - workout.totalDurationMinutes) > 1) {
      throw new UnprocessableEntityException(
        `Durée incohérente pour « ${workout.title} » : étapes=${stepsTotal} min, total déclaré=${workout.totalDurationMinutes} min.`,
      );
    }
  }

  private externalId(workout: Workout): string {
    const normalizedTitle = workout.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 32);

    const hash = createHash('sha1')
      .update(`${workout.date}|${workout.title}`)
      .digest('hex')
      .slice(0, 10);

    return `coach-${workout.date}-${normalizedTitle || 'ride'}-${hash}`;
  }
}
