import { Module } from "@nestjs/common";
import { TrainingContextBuilder } from "./TrainingContextBuilder.js";
import { IntervalsModule } from "../intervals/intervals.module.js";
import { CoachController } from "./CoachController.js";
import { CoachService } from "./CoachService.js";
import { LlmService } from "./LlmService.js";
import { PromptBuilder } from "./PrompBuilder.js";
import { IntervalsWorkoutsModule } from "../intervals-workouts/intervals-workouts.module.js";
import { ReviewWeekTrainingStorageService } from "./review-week-training-storage.service.js";

@Module({
    imports: [IntervalsModule, IntervalsWorkoutsModule],
    controllers: [CoachController],
    providers: [TrainingContextBuilder, CoachService, LlmService, PromptBuilder, ReviewWeekTrainingStorageService],
})
export class CoachModule { }