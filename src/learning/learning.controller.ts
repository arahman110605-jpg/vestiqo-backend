import { Controller, Get, Post, Req, Body } from '@nestjs/common';
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

  @Post('quiz-attempt')
  async submitQuizAttempt(@Req() req, @Body() body: { quizId: string; score: number; passed: boolean }) {
    const userId = req.user.id;
    return this.learningService.submitQuizAttempt(userId, body.quizId, body.score, body.passed);
  }

  @Get('completed-lessons')
  async getCompletedLessons(@Req() req) {
    const userId = req.user.id;
    return this.learningService.getCompletedLessons(userId);
  }
}
