import { Controller, Get } from "@nestjs/common";
import { TrainingContextBuilder } from "./TrainingContextBuilder.js";
import { CoachService } from "./CoachService.js";

@Controller('coach')
export class CoachController {

    constructor(private readonly coachService: CoachService) { }

    @Get()
    async getCoachData() {
        return await this.coachService.generatePlan()
    }
}