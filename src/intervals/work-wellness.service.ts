import { Injectable } from '@nestjs/common';
import { Wellness } from './interfaces/Wellness.js';
import { IntervalsClient } from '../intervals/intervals.client.js';
import { IntervalsIcuMapper, IntervalsWellnessDto } from './mappers/IntervalsIcuMapper.js';
import { IntervalsService } from './intervals.services.js';

@Injectable()
export class WellnessService {
  constructor(
    private readonly intervalsClient: IntervalsClient,
    private readonly intervalsService: IntervalsService
  ) { }

  async getWellness(): Promise<Wellness[]> {
    try {
      // Use the existing method from IntervalsService with default date range
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const wellnessData = await this.intervalsService.getWellness(
        today.toISOString().slice(0, 10),
        tomorrow.toISOString().slice(0, 10)
      );

      return wellnessData;
    } catch (error) {
      console.error('Error fetching wellness data:', error);
      return [];
    }
  }

  async getLatestWellness(): Promise<Wellness | null> {
    const allWellness = await this.getWellness();
    if (!allWellness || allWellness.length === 0) {
      return null;
    }

    // Sort by date and get the latest entry
    const sorted = [...allWellness].sort((a, b) => {
      if (!b.date) return -1;
      if (!a.date) return 1;

      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (isNaN(dateA)) return 1; // Put invalid dates at the end
      if (isNaN(dateB)) return -1; // Put invalid dates at the beginning

      return dateB - dateA;
    });
    return sorted[0];
  }
}

