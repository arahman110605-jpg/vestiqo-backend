import { Controller, Get } from '@nestjs/common';
import { LearningService } from './learning.service';
import { Public } from '../auth/public.decorator';

@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Public()
  @Get('paths')
  async getPaths() {
    return this.learningService.getLearningPaths();
  }
}
