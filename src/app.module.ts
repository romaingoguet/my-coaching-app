import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { IntervalsModule } from './intervals/intervals.module.js';
import { ConfigModule } from '@nestjs/config';
import { CoachModule } from './coach/coach.module.js';
import { IntervalsWorkoutsModule } from './intervals-workouts/intervals-workouts.module.js';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), IntervalsModule, CoachModule, IntervalsWorkoutsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
