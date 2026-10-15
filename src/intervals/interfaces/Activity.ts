export interface Activity {
  id: string;
  date: string;
  name: string;
  sport: string;

  durationSeconds: number;
  elapsedSeconds?: number;
  distanceMeters?: number;
  elevationGainMeters?: number;

  averagePowerWatts?: number;
  normalizedPowerWatts?: number;
  ftpWattsAtActivity?: number;

  averageHeartRateBpm?: number;
  maxHeartRateBpm?: number;

  trainingLoad?: number;
  intensityFactor?: number;
  efficiencyFactor?: number;
  decouplingPercent?: number;

  perceivedExertion?: number;
  feel?: number;

  powerZoneTimes?: number[];
  heartRateZoneTimes?: number[];

  isIndoor?: boolean;
  usesDevicePower?: boolean;
  tags?: string[];

  icu_rpe?: number;
}