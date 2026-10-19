import { Controller, Get } from '@nestjs/common';
import { WellnessService } from '../intervals/workwellness.service.js';

@Controller('wellness')
export class WellnessController {
  constructor(private readonly wellnessService: WellnessService) {}

  @Get()
  async getWellness(): Promise<any[]> {
    return await this.wellnessService.getWellness();
  }

  @Get('/latest')
  async getLatestWellness(): Promise<any | null> {
    return await this.wellnessService.getLatestWellness();
  }
}