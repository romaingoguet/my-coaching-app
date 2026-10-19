import { Module } from "@nestjs/common";
import { IntervalsController } from "./intervals.controller.js";
import { WellnessController } from "./wellness.controller.js";
import { IntervalsClient } from "./intervals.client.js";
import { IntervalsService } from "./intervals.services.js";
import { WellnessService } from "./workwellness.service.js";


@Module({
    imports: [],
    controllers: [IntervalsController, WellnessController],
    providers: [IntervalsClient, IntervalsService, WellnessService],
    exports: [IntervalsService]
})
export class IntervalsModule { }