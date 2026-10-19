import { Controller, Get } from "@nestjs/common";
import { IntervalsService } from "./intervals.services.js";
import { Wellness } from "./interfaces/Wellness.js";
import { AthleteMetrics } from "./mappers/IntervalsIcuMapper.js";
import { Activity } from "./interfaces/Activity.js";

@Controller('athlete')
export class IntervalsController {

    constructor(private readonly intervalsService: IntervalsService) { }

    @Get()
    async getAthlete(): Promise<Activity[]> {
        return await this.intervalsService.getActivities('2026-10-01', '2026-10-09');
    }
}