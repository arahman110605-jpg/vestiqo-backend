import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  async awardBadge(userId: string, badgeName: string) {
    this.logger.log(`Awarding badge '${badgeName}' to user ${userId}`);
    // Logic to insert badge into UserBadges table (needs to be added to Prisma schema later)
  }

  async checkDailyMissions(userId: string) {
    // Logic to evaluate daily missions like "Complete 1 lesson"
    // If complete, award XP and Coins.
  }

  async fetchActiveChallenges() {
    return prisma.challenge.findMany({
      where: {
        endDate: { gte: new Date() }
      }
    });
  }
}
