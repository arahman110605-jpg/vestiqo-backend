import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateDailyMissions(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.dailyMission.findMany({
      where: { userId, date: { gte: today } },
    });

    if (existing.length > 0) return existing;

    const missionTypes = [
      { type: 'complete_lesson', target: 1, rewardXp: 20, rewardCoins: 10 },
      { type: 'execute_trade', target: 1, rewardXp: 20, rewardCoins: 10 },
      { type: 'review_portfolio', target: 1, rewardXp: 20, rewardCoins: 10 },
    ];

    const created = await this.prisma.$transaction(
      missionTypes.map((m) =>
        this.prisma.dailyMission.create({
          data: { userId, ...m },
        }),
      ),
    );

    return created;
  }

  async getDailyMissions(userId: string) {
    return this.generateDailyMissions(userId);
  }

  async completeMission(userId: string, missionId: string) {
    const mission = await this.prisma.dailyMission.findFirst({
      where: { id: missionId, userId, completed: false },
    });

    if (!mission) return { success: false, message: 'Mission not found or already completed' };

    await this.prisma.$transaction([
      this.prisma.dailyMission.update({
        where: { id: missionId },
        data: { completed: true, progress: mission.target },
      }),
      this.prisma.profile.update({
        where: { userId },
        data: {
          xp: { increment: mission.rewardXp },
          coins: { increment: mission.rewardCoins },
        },
      }),
    ]);

    return { success: true, rewardXp: mission.rewardXp, rewardCoins: mission.rewardCoins };
  }

  async checkMissionProgress(userId: string, type: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mission = await this.prisma.dailyMission.findFirst({
      where: { userId, type, date: { gte: today }, completed: false },
    });

    if (!mission) return;

    const newProgress = mission.progress + 1;
    const completed = newProgress >= mission.target;

    await this.prisma.dailyMission.update({
      where: { id: mission.id },
      data: { progress: newProgress, completed },
    });

    if (completed) {
      await this.prisma.profile.update({
        where: { userId },
        data: {
          xp: { increment: mission.rewardXp },
          coins: { increment: mission.rewardCoins },
        },
      });
    }
  }

  async awardBadge(userId: string, badgeName: string) {
    this.logger.log(`Awarding badge '${badgeName}' to user ${userId}`);
  }

  async fetchActiveChallenges() {
    return this.prisma.challenge.findMany({
      where: { endDate: { gte: new Date() } },
    });
  }
}
