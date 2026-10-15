import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { IntervalsService } from '../intervals/intervals.services.js';
import { TrainingContext } from '../intervals/interfaces/TrainingContext.js';


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
      actualWeekMondayDate
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
}

