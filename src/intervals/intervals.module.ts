import { Module } from "@nestjs/common";
import { IntervalsController } from "./intervals.controller.js";
import { IntervalsClient } from "./intervals.client.js";
import { IntervalsService } from "./intervals.services.js";


@Module({
    imports: [],
    controllers: [IntervalsController],
    providers: [IntervalsClient, IntervalsService],
    exports: [IntervalsService]
})
export class IntervalsModule { }