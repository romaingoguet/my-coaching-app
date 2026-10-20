import { Module } from "@nestjs/common";
import { IntervalsController } from "./athlete.controllers.js";
import { IntervalsClient } from "./intervals.client.js";
import { IntervalsService } from "./intervals.services.js";
import { WellnessService } from "./workwellness.service.js";


@Module({
    imports: [],
    controllers: [IntervalsController],
    providers: [IntervalsClient, IntervalsService, WellnessService],
    exports: [IntervalsService]
})
export class IntervalsModule { }