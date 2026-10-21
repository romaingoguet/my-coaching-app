import { Activity } from "../interfaces/Activity.js";
import { Wellness } from "../interfaces/Wellness.js";
import { PlannedSession } from "../interfaces/TrainingPlan.js";

export interface IntervalsActivityDto {
  id: number | string;
  start_date_local?: string;
  name?: string;
  type?: string;
  icu_sport_type?: string;

  moving_time?: number;
  elapsed_time?: number;
  distance?: number;
  total_elevation_gain?: number;

  icu_average_watts?: number;
  average_watts?: number;
  icu_weighted_avg_watts?: number;
  weighted_average_watts?: number;
  icu_ftp?: number;

  average_heartrate?: number;
  max_heartrate?: number;

  icu_training_load?: number;
  icu_intensity?: number;
  icu_efficiency_factor?: number;
  decoupling?: number;

  perceived_exertion?: number;
  feel?: number;

  icu_zone_times?: number[];
  icu_hr_zone_times?: number[];

  trainer?: boolean;
  device_watts?: boolean;
  tags?: string[];

  icu_rpe?: number;
}

export interface IntervalsAthleteDto {
  id?: string;
  name?: string;
  icu_weight?: number;
  sportSettings?: IntervalsSportSettingsDto[];
}

export interface IntervalsSportSettingsDto {
  types?: string[];
  ftp?: number;
  indoor_ftp?: number;
  eFTPSupported?: boolean;
  mmp_model?: {
    ftp?: number;
  };
}

export interface AthleteMetrics {
  weightKg?: number;
  ftpWatts?: number;
  indoorFtpWatts?: number;
  estimatedFtpWatts?: number;
}

export class IntervalsIcuMapper {
  static toAthleteMetrics(
    raw: IntervalsAthleteDto,
  ): AthleteMetrics {
    const cyclingSettings = raw.sportSettings?.find(
      (settings) =>
        settings.types?.some((type) =>
          ['Ride', 'VirtualRide', 'GravelRide', 'MountainBikeRide']
            .includes(type),
        ),
    );

    return {
      weightKg: raw.icu_weight,
      ftpWatts: cyclingSettings?.ftp,
      indoorFtpWatts: cyclingSettings?.indoor_ftp,
      estimatedFtpWatts:
        cyclingSettings?.eFTPSupported
          ? cyclingSettings.mmp_model?.ftp
          : undefined,
    };
  }

  static toActivity(raw: IntervalsActivityDto): Activity {
    if (raw.id === undefined || raw.id === null) {
      throw new Error('Intervals.icu activity has no id');
    }

    if (!raw.start_date_local) {
      throw new Error(
        `Intervals.icu activity ${raw.id} has no start date`,
      );
    }

    if (raw.moving_time == null) {
      throw new Error(
        `Intervals.icu activity ${raw.id} has no moving time`,
      );
    }

    const objext = {
      id: String(raw.id),
      date: raw.start_date_local,
      name: raw.name ?? 'Unnamed activity',
      sport: raw.icu_sport_type ?? raw.type ?? 'Unknown',

      durationSeconds: raw.moving_time,
      elapsedSeconds: raw.elapsed_time,
      distanceMeters: raw.distance,
      elevationGainMeters: raw.total_elevation_gain,

      averagePowerWatts:
        raw.icu_average_watts ?? raw.average_watts,

      normalizedPowerWatts:
        raw.icu_weighted_avg_watts ??
        raw.weighted_average_watts,

      ftpWattsAtActivity: raw.icu_ftp,

      averageHeartRateBpm: raw.average_heartrate,
      maxHeartRateBpm: raw.max_heartrate,

      trainingLoad: raw.icu_training_load,
      intensityFactor: raw.icu_intensity,
      efficiencyFactor: raw.icu_efficiency_factor,
      decouplingPercent: raw.decoupling,

      perceivedExertion: raw.icu_rpe,
      feel: raw.feel,

      powerZoneTimes: raw.icu_zone_times,
      heartRateZoneTimes: raw.icu_hr_zone_times,

      isIndoor: raw.trainer,
      usesDevicePower: raw.device_watts,
      tags: raw.tags,
    };

    //console.log(objext)

    return objext;
  }

  static toActivities(
    dtos: IntervalsActivityDto[],
  ): Activity[] {
    return dtos.map((dto) => this.toActivity(dto));
  }

  private static mapSport(
    type?: string,
  ): Activity['sport'] {
    switch (type?.toLowerCase()) {
      case 'ride':
        return 'ride';

      case 'gravelride':
        return 'gravel';

      case 'virtualride':
        return 'virtual';

      default:
        return 'other';
    }
  }

  static toWellness(raw: IntervalsWellnessDto): Wellness {


    return {
      date: raw.id,
      restingHeartRate: raw.restingHR,
      hrv: raw.hrv,
      sleepSeconds: raw.sleepSecs,
      sleepQuality: raw.sleepQuality,
      fatigue: raw.fatigue,
      soreness: raw.soreness,
      stress: raw.stress,
      mood: raw.mood,
      motivation: raw.motivation,
      weightKg: raw.weight,
    };
  }

  static toWellnessList(
    entries: IntervalsWellnessDto[],
  ): Wellness[] {
    return entries.map((entry) => this.toWellness(entry));
  }
}

export interface IntervalsWellnessDto {
  id?: string;

  restingHR?: number;
  hrv?: number;

  sleepSecs?: number;
  sleepQuality?: number;

  fatigue?: number;
  soreness?: number;
  stress?: number;
  mood?: number;
  motivation?: number;

  weight?: number;
}

export interface IntervalsPlannedSessionDto {
  start_date_local: string; // start_date_local from API
  name: string; // name from API
  moving_time: number; // moving_time / 60 from API

  description: string; // description from API
  workout?: {
    type: string;
    description: string;
  };

  flexibility: 'fixed' | 'flexible' | 'optional';
}

export interface ScheduledSession {
  date: string;
  title: string;
  durationMinutes: number;
  objective: string;
  workout?: {
    type: string;
    description: string;
  };
  flexibility: 'fixed' | 'flexible' | 'optional';
}

export class IntervalsPlannedSessionMapper {
  static toScheduledSession(
    dto: IntervalsPlannedSessionDto,
  ): ScheduledSession {
    return {
      date: dto.start_date_local,
      title: dto.name,
      durationMinutes: dto.moving_time,
      objective: dto.description,
      workout: dto.workout,
      flexibility: dto.flexibility,
    };
  }

  static toScheduledSessions(
    dtos: IntervalsPlannedSessionDto[],
  ): ScheduledSession[] {
    return dtos.map((dto) => this.toScheduledSession(dto));
  }
}