import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async getProfile(email: string) {
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        readinessScore: true,
        portfolioHealth: true,
      },
    });
    
    if (!user) {
      throw new NotFoundException('User not found. Please call POST /auth/sync first.');
    }

    // Mock badges for Phase 7
    const mockBadges = [
      { name: 'First Trade', icon: '🎯' },
      { name: 'Quiz Master', icon: '🧠' },
      { name: '7-Day Streak', icon: '🔥' },
      { name: 'Diversifier', icon: '🍕' }
    ];

    return {
      ...user,
      badges: mockBadges
    };
  }

  async getProfileByAuthId(supabaseAuthId: string) {
    const user = await prisma.user.findUnique({
      where: { supabaseAuthId },
      include: {
        profile: true,
        readinessScore: true,
        portfolioHealth: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
