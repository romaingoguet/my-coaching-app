import { Injectable } from '@nestjs/common';
import { TrainingContextBuilder } from './TrainingContextBuilder.js';
import { LlmService } from './LlmService.js';
import { TrainingPlan } from '../intervals-workouts/training-plan.types.js';
import { ReviewWeekTrainingStorageService } from './review-week-training-storage.service.js';

export interface ReviewWeekTrainingResponse {
  review: string;
  date: string;
}

@Injectable()
export class CoachService {
  constructor(
    private readonly contextBuilder: TrainingContextBuilder,
    private readonly llmService: LlmService,
    private readonly storageService: ReviewWeekTrainingStorageService,
  ) { }
  async generatePlan(): Promise<TrainingPlan> {
    const context = await this.contextBuilder.build();

    return this.llmService.generateTrainingPlan(context);
  }

  async getReviewWeekTraining() {
    // Get activities from intervals ICU (same data used for training week)
    const context = await this.contextBuilder.build();

    // Filter to only include Monday-Sunday trainings of the current week
    const mondaySundayTrainings = this.filterMondaySundayTrainings(context.recentActivities);

    const result = await this.llmService.generateReviewWeekTraining(
      { ...context, filteredActivities: mondaySundayTrainings } as any,
    );

    // Save to JSON file
    await this.storageService.save(result);

    return result;
  }



  private filterMondaySundayTrainings(activities: any[]) {
    // Filter activities to only include those from Monday to Sunday of the current week
    const today = new Date();
    const currentWeekStart = this.getCurrentWeekMonday(today);

    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const activityDateString = activityDate.toISOString().slice(0, 10);

      // Only include activities from Monday to Sunday of the current week
      return activityDateString >= currentWeekStart;
    });
  }

  private getCurrentWeekMonday(date: Date): string {
    const day = date.getDay(); // Dimanche = 0, lundi = 1, ...
    const daysSinceMonday = (day + 6) % 7;

    const mondayDate = new Date(date);
    mondayDate.setDate(date.getDate() - daysSinceMonday);

    return `${mondayDate.getFullYear()}-${String(mondayDate.getMonth() + 1).padStart(2, '0')}-${String(mondayDate.getDate()).padStart(2, '0')}`;
  }
}