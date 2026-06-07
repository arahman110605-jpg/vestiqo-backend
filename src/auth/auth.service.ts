import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  /**
   * Syncs a Supabase-authenticated user with the local database.
   * If the user doesn't exist, creates a new User + Profile record.
   */
  async syncUser(supabaseAuthId: string, email: string, displayName?: string) {
    // Check if the user already exists by supabaseAuthId
    let user = await prisma.user.findUnique({
      where: { supabaseAuthId },
      include: { profile: true },
    });

    if (!user) {
      // Create new user with profile
      user = await prisma.user.create({
        data: {
          email,
          supabaseAuthId,
          profile: {
            create: {
              displayName: displayName || email.split('@')[0],
              experienceLevel: 'Beginner',
              xp: 0,
              level: 1,
              learningStreak: 0,
            },
          },
          readinessScore: {
            create: {
              overallScore: 0,
              riskManagement: 'N/A',
              diversification: 'N/A',
              stockAnalysis: 'N/A',
            }
          },
          portfolioHealth: {
            create: {
              score: 0,
              concentrationRisk: 0,
              volatility: 0,
            }
          }
        },
        include: { profile: true },
      });
    }

    return user;
  }
}
