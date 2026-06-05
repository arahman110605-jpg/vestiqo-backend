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
}
