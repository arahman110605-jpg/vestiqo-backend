import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}

  async getLearningPaths() {
    return this.prisma.learningPath.findMany({
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            steps: { orderBy: { order: 'asc' } },
            quizzes: true,
          }
        },
      },
    });
  }

  async getLessonSteps(lessonId: string) {
    return this.prisma.lessonStep.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' },
    });
  }

  async submitQuizAttempt(userId: string, quizId: string, score: number, passed: boolean) {
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        passed,
      }
    });

    if (passed) {
      // Award XP to user profile
      await this.prisma.profile.update({
        where: { userId },
        data: {
          xp: { increment: 50 },
          learningStreak: { increment: 1 }
        }
      });
    }

    return attempt;
  }

  async getCompletedLessons(userId: string) {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId, passed: true },
      include: { quiz: true }
    });

    const completedLessonIds = attempts.map(a => a.quiz.lessonId);
    // Return unique lesson IDs
    return Array.from(new Set(completedLessonIds));
  }
}
