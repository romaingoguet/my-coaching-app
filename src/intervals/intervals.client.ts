import { Injectable } from "@nestjs/common";

@Injectable()
export class IntervalsClient {
  private readonly baseUrl = 'https://intervals.icu/api/v1';

  constructor() {}

  private get auth() {
    const apiKey = process.env.APIKEY;

    return Buffer
      .from(`API_KEY:${apiKey}`)
      .toString('base64');
  }

  async get<T>(path: string): Promise<T> {
    console.log(`Fetching ${this.baseUrl}${path}`);
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        Authorization: `Basic ${this.auth}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Intervals.icu returned ${response.status}`,
      );
    }

    return response.json();
  }
}
