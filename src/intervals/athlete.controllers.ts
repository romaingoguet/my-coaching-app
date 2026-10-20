import { Controller, Get } from "@nestjs/common";
import { IntervalsService } from "./intervals.services.js";
import { Wellness } from "./interfaces/Wellness.js";
import { AthleteMetrics } from "./mappers/IntervalsIcuMapper.js";
import { Activity } from "./interfaces/Activity.js";
import { WellnessService } from "./work-wellness.service.js";

@Controller('athlete')
export class IntervalsController {

    constructor(private readonly intervalsService: IntervalsService, private readonly wellnessService: WellnessService) { }

    @Get()
    async getAthlete(): Promise<Activity[]> {
        return await this.intervalsService.getActivities('2026-10-01', '2026-10-09');
    }

    @Get('/wellness')
    async getWellness(): Promise<any[]> {
        return await this.wellnessService.getWellness();
    }

    @Get('/wellness/latest')
    async getLatestWellness(): Promise<any | null> {
        return await this.wellnessService.getLatestWellness();
    }
}

