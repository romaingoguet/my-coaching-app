import { Injectable } from "@nestjs/common";
import { IntervalsClient } from "./intervals.client.js";
import { Wellness } from "./interfaces/Wellness.js";
import { Activity } from "./interfaces/Activity.js";
import { AthleteMetrics, IntervalsAthleteDto, IntervalsIcuMapper, IntervalsPlannedSessionDto, IntervalsPlannedSessionMapper } from "./mappers/IntervalsIcuMapper.js";
import { PlannedSession } from "./interfaces/TrainingPlan.js";

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

  async getActivitiesForCurrentWeek(): Promise<Activity[]> {
    const today = new Date();

    // Calculate Monday of current week (Monday is day 0)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Calculate Sunday of current week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    return await this.getActivities(formatDate(startOfWeek), formatDate(endOfWeek));
  }

  async getNextScheduledSession(): Promise<PlannedSession[]> {
    const response = await this.client.get<
      IntervalsPlannedSessionDto[]
    >(`/athlete/${process.env.ATHLETE_ID}/events`);

    return IntervalsPlannedSessionMapper.toScheduledSessions(response)
  }

}

