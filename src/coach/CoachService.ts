import { Injectable } from '@nestjs/common';
import { TrainingContextBuilder } from './TrainingContextBuilder.js';
import { LlmService } from './LlmService.js';
import { TrainingPlan } from '../intervals-workouts/training-plan.types.js';

@Injectable()
export class CoachService {
  constructor(
    private readonly contextBuilder: TrainingContextBuilder,
    private readonly llmService: LlmService,
  ) { }

  async generatePlan(): Promise<TrainingPlan> {
    const context = await this.contextBuilder.build();

    return this.llmService.generateTrainingPlan(context);
  }
}