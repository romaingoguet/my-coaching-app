export interface ActivityInterval {
  id?: number;

  startSeconds: number;
  durationSeconds: number;

  type?: string;

  repetitions?: number;

  averagePowerWatts?: number;
  maxPowerWatts?: number;

  averageHeartRate?: number;

  intensityFactor?: number;

  tss?: number;

  name?: string;
}