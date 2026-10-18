import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { IntervalsService } from '../intervals/intervals.services.js';
import { TrainingContext } from '../intervals/interfaces/TrainingContext.js';
import { Activity } from '../intervals/interfaces/Activity.js';


@Injectable()
export class TrainingContextBuilder {
  constructor(
    private readonly intervalsService: IntervalsService,
  ) { }

  async build(): Promise<TrainingContext> {
    const currentDate = new Date();
    const today = this.formatDate(currentDate);

    // Fenêtre de données récentes et événements futurs
    const oldest = this.formatDate(
      new Date(currentDate.getTime() - 28 * 24 * 60 * 60 * 1000),
    );

    const newest = this.formatDate(
      new Date(currentDate.getTime() + 56 * 24 * 60 * 60 * 1000),
    );

    const [
      profile,
      trainingContext,
      availability,
      recentActivities,
      recentWellness,
      athleteMetrics,
      weekInfos,
      actualWeekMondayDate
    ] = await Promise.all([
      this.readMarkdown('./config/profile.md'),
      this.readMarkdown('./config/training.md'),
      this.readMarkdown('./config/availability.md'),

      this.intervalsService.getActivities(oldest, today),
      this.intervalsService.getWellness(oldest, today),
      this.intervalsService.getAthlete(),
      this.getIsoWeekInfo(new Date(this.getNextMonday())),
      this.getCurrentWeekMonday(new Date())
    ]);

    const response = {
      date: currentDate.toISOString(),
      profile,
      trainingContext,
      availability,
      recentActivities,
      recentWellness,
      athleteMetrics,
      weekParity: weekInfos.weekParity,
      actualWeekMondayDate,
      weekDates: this.getWeekDates(actualWeekMondayDate)
    };

    return response
  }

  async buildForReview(): Promise<TrainingContext> {
    const currentDate = new Date();
    const today = this.formatDate(currentDate);

    // Fenêtre de données récentes et événements futurs
    const oldest = this.formatDate(
      new Date(currentDate.getTime() - 28 * 24 * 60 * 60 * 1000),
    );

    const newest = this.formatDate(
      new Date(currentDate.getTime() + 56 * 24 * 60 * 60 * 1000),
    );

    const [
      profile,
      trainingContext,
      availability,
      recentActivities,
      recentWellness,
      athleteMetrics,
      weekInfos,
      actualWeekMondayDate
    ] = await Promise.all([
      this.readMarkdown('./config/profile.md'),
      this.readMarkdown('./config/training.md'),
      this.readMarkdown('./config/availability.md'),

      this.intervalsService.getActivities(oldest, today),
      this.intervalsService.getWellness(oldest, today),
      this.intervalsService.getAthlete(),
      this.getIsoWeekInfo(new Date(this.getNextMonday())),
      this.getCurrentWeekMonday(new Date())
    ]);

    // Filter activities to only include Monday-Sunday trainings of the current week
    const mondaySundayTrainings = this.filterMondaySundayTrainings(recentActivities);

    const response = {
      date: currentDate.toISOString(),
      profile,
      trainingContext,
      availability,
      recentActivities,
      filteredRecentActivities: mondaySundayTrainings,
      recentWellness,
      athleteMetrics,
      weekParity: weekInfos.weekParity,
      actualWeekMondayDate,
      weekDates: this.getWeekDates(actualWeekMondayDate)
    };

    return response
  }

  private async readMarkdown(filename: string): Promise<string> {
    const path = join(process.cwd(), 'src', filename);
    return readFile(path, 'utf-8');
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private getWeekDates(weekStart: string): Record<string, string> {
    const [year, month, day] = weekStart.split('-').map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));

    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    return Object.fromEntries(
      days.map((dayName, index) => {
        const current = new Date(date);
        current.setUTCDate(date.getUTCDate() + index);

        return [
          dayName,
          current.toISOString().slice(0, 10),
        ];
      }),
    );
  }

  private getIsoWeekInfo(date: Date): { weekNumber: number; weekParity: 'odd' | 'even' } {
    // Find Thursday of the current week (ISO standard)
    const day = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 3,
    );

    // Calculate days since January 4th of that year
    const januaryFourth = new Date(
      day.getUTCFullYear(),
      0,
      4,
    );

    const weekNumber = Math.ceil((day.getTime() - januaryFourth.getTime()) / (7 * 24 * 60 * 60 * 1000));

    // Find the Monday of this ISO week
    const monday = new Date(day);
    monday.setDate(monday.getDate() - day.getDay() + 1);

    const weekParity = weekNumber % 2 === 0 ? 'even' as const : 'odd' as const;

    return {
      weekNumber,
      weekParity: weekParity,
    };
  }

  private getNextMonday(from: Date = new Date()): string {
    const date = new Date(from);
    const day = date.getDay(); // Dimanche = 0, lundi = 1, ...

    const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7 || 7;

    date.setDate(date.getDate() + daysUntilMonday);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${dayOfMonth}`;
  }

  private getCurrentWeekMonday(from: Date = new Date()): string {
    const date = new Date(from);
    const day = date.getDay();

    const daysSinceMonday = (day + 6) % 7;
    date.setDate(date.getDate() - daysSinceMonday);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${dayOfMonth}`;
  }

  private filterMondaySundayTrainings(activities: Activity[]): Activity[] {
    const today = new Date();
    const currentWeekMonday = this.getCurrentWeekMonday(today);

    return activities.filter(activity => {
      const activityDate = new Date(activity.date);

      // Get the Monday of the week containing the activity
      const activityWeekMonday = this.getWeekMonday(activityDate);

      // Check if the activity falls within the current week (Monday to Sunday)
      return activityWeekMonday === currentWeekMonday;
    });
  }

  private getWeekMonday(date: Date): string {
    const day = date.getDay(); // Dimanche = 0, lundi = 1, ...

    const daysSinceMonday = (day + 6) % 7;
    date.setDate(date.getDate() - daysSinceMonday);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${dayOfMonth}`;
  }
}
