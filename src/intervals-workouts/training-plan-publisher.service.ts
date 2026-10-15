import { Injectable } from '@nestjs/common';
import { IntervalsWorkoutEvent, IntervalsWorkoutMapper } from './intervals-workout.mapper.js';
import { IntervalsWorkoutService } from './intervals-workout.service.js';
import { TrainingPlan, TrainingPlanSchema } from './training-plan.types.js';


@Injectable()
export class TrainingPlanPublisherService {
  constructor(
    private readonly mapper: IntervalsWorkoutMapper,
    private readonly intervals: IntervalsWorkoutService,
  ) { }

  preview(input: unknown): IntervalsWorkoutEvent[] {
    const plan = TrainingPlanSchema.parse(input);
    return this.mapper.toEvents(plan);
  }

  async publish(input: unknown): Promise<{
    publishedEvents: IntervalsWorkoutEvent[];
    apiResponse: unknown;
  }> {
    const publishedEvents = this.preview(input);
    const apiResponse = await this.intervals.publish(publishedEvents);
    return { publishedEvents, apiResponse };
  }
}
