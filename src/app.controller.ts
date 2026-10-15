import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { IntervalsClient } from './intervals/intervals.client.js';
import { IntervalsService } from './intervals/intervals.services.js';
import { Wellness } from './intervals/interfaces/Wellness.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
