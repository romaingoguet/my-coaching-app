import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IntervalsWorkoutEvent } from './intervals-workout.mapper.js';

@Injectable()
export class IntervalsWorkoutService {
  private readonly logger = new Logger(IntervalsWorkoutService.name);
  private readonly baseUrl = 'https://intervals.icu';

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) { }

  async publish(events: IntervalsWorkoutEvent[]): Promise<unknown> {
    if (events.length === 0) return [];

    const athleteId = process.env.ATHLETE_ID ?? '';
    const apiKey = process.env.APIKEY ?? '';

    try {
      const response = await firstValueFrom(
        this.http.post<unknown>(
          `${this.baseUrl}/api/v1/athlete/${encodeURIComponent(athleteId)}/events/bulk`,
          events,
          {
            params: { upsert: true },
            auth: { username: 'API_KEY', password: apiKey },
            timeout: 20_000,
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Échec de publication des séances dans Intervals.icu');
      throw new ServiceUnavailableException(
        'Impossible de publier les séances dans Intervals.icu. Vérifie la connexion, les identifiants et le format des événements.',
      );
    }
  }
}
