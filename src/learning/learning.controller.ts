import { Controller, Get, Post, Req, Body, Param } from '@nestjs/common';
import { LearningService } from './learning.service';
import { Public } from '../auth/public.decorator';
import { QuizAttemptDto } from './dto/quiz-attempt.dto';

@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Public()
  @Get('paths')
  async getPaths() {
    return this.learningService.getLearningPaths();
  }

  @Public()
  @Get('lesson/:id/steps')
  async getLessonSteps(@Param('id') id: string) {
    return this.learningService.getLessonSteps(id);
  }

  @Post('quiz-attempt')
  async submitQuizAttempt(@Req() req, @Body() dto: QuizAttemptDto) {
    const userId = req.user.id;
    return this.learningService.submitQuizAttempt(userId, dto.quizId, dto.score, dto.passed === 'true');
  }

  @Get('completed-lessons')
  async getCompletedLessons(@Req() req) {
    const userId = req.user.id;
    return this.learningService.getCompletedLessons(userId);
  }
}
