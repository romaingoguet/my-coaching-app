import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface ReviewWeekTrainingEntry {
  review: string;
  date: string;
}

@Injectable()
export class ReviewWeekTrainingStorageService {
  private readonly storagePath = path.join(
    process.cwd(),
    'src',
    'data',
    'review-week-training.json'
  );

  constructor() {
    // Ensure the data directory exists
    fs.mkdir(path.dirname(this.storagePath), { recursive: true })
      .catch(() => {
        // Ignore if directory already exists
      });
  }

  async save(entry: ReviewWeekTrainingEntry): Promise<void> {
    const existingData = await this.getExistingData();

    const newEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    existingData.push(newEntry);

    await fs.writeFile(
      this.storagePath,
      JSON.stringify(existingData, null, 2),
      'utf-8'
    );
  }

  async getExistingData(): Promise<ReviewWeekTrainingEntry[]> {
    try {
      const data = await fs.readFile(this.storagePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Return empty array if file doesn't exist yet
      return [];
    }
  }

  async getAllEntries(): Promise<ReviewWeekTrainingEntry[]> {
    const data = await this.getExistingData();
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
