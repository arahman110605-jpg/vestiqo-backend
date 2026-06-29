import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(email: string) {
    let user = await this.prisma.user.findUnique({
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

    // TODO: Fetch actual badges from the database
    return {
      ...user,
      badges: []
    };
  }

  async getProfileByAuthId(supabaseAuthId: string) {
    const user = await this.prisma.user.findUnique({
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
