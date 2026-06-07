import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class LearningService {
  async getLearningPaths() {
    return prisma.learningPath.findMany({
      include: {
        lessons: {
          include: {
            quizzes: true,
          }
        },
      },
    });
  }

  async submitQuizAttempt(userId: string, quizId: string, score: number, passed: boolean) {
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        passed,
      }
    });

    if (passed) {
      // Award XP to user profile
      await prisma.profile.update({
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
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId, passed: true },
      include: { quiz: true }
    });

    const completedLessonIds = attempts.map(a => a.quiz.lessonId);
    // Return unique lesson IDs
    return Array.from(new Set(completedLessonIds));
  }
}
