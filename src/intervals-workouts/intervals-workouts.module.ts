import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IntervalsWorkoutMapper } from './intervals-workout.mapper.js';
import { IntervalsWorkoutService } from './interval-workouts.service.js';
import { TrainingPlanPublisherService } from './training-plan-publisher.service.js';

@Module({
  imports: [HttpModule],
  providers: [
    IntervalsWorkoutMapper,
    IntervalsWorkoutService,
    TrainingPlanPublisherService,
  ],
  exports: [TrainingPlanPublisherService, IntervalsWorkoutMapper],
})
export class IntervalsWorkoutsModule { }
