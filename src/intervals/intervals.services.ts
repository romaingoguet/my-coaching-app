import { Injectable } from "@nestjs/common";
import { IntervalsClient } from "./intervals.client.js";
import { Wellness } from "./interfaces/Wellness.js";
import { Activity } from "./interfaces/Activity.js";
import { AthleteMetrics, IntervalsAthleteDto, IntervalsIcuMapper } from "./mappers/IntervalsIcuMapper.js";

@Injectable()
export class IntervalsService {
  constructor(
    private readonly client: IntervalsClient
  ) { }

  async getWellness(from: string, to: string) {
    console.log('Getting Wellness')
    const response = await this.client.get<Wellness[]>(
      `/athlete/${process.env.ATHLETE_ID}/wellness` +
      `?oldest=${from}&newest=${to}`,
    );
    //console.log(response)
    return IntervalsIcuMapper.toWellnessList(response)
  }

  async getActivities(from: string, to: string) {
    const response = await this.client.get<Activity[]>(
      `/athlete/${process.env.ATHLETE_ID}/activities` +
      `?oldest=${from}&newest=${to}`,
    );
    return IntervalsIcuMapper.toActivities(response)
  }

  async getAthlete(): Promise<AthleteMetrics> {
    const response = await this.client.get<IntervalsAthleteDto>(
      `/athlete/${process.env.ATHLETE_ID}`,
    );

    return IntervalsIcuMapper.toAthleteMetrics(response);
  }
}
