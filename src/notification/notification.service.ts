import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

let admin: any;
try {
  admin = require('firebase-admin');
} catch {
  admin = null;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly fcmEnabled: boolean;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    if (admin && this.config.get<string>('FIREBASE_PROJECT_ID')) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
            clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
            privateKey: this.config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
          }),
        });
        this.fcmEnabled = true;
        this.logger.log('Firebase Admin initialized for FCM');
      } catch (err) {
        this.logger.warn('Firebase Admin init failed: ' + err.message);
        this.fcmEnabled = false;
      }
    } else {
      this.fcmEnabled = false;
    }
  }

  async sendSmartNotification(userId: string, title: string, message: string, usePush: boolean = false) {
    await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        read: false,
      },
    });

    if (usePush && this.fcmEnabled) {
      const profile = await this.prisma.profile.findUnique({ where: { userId } });
      if (profile?.fcmToken) {
        try {
          await admin.messaging().send({
            token: profile.fcmToken,
            notification: { title, body: message },
          });
          this.logger.log(`FCM sent to ${userId}: ${title}`);
        } catch (err) {
          this.logger.warn(`FCM failed for ${userId}: ${err.message}`);
        }
      }
    }
  }

  async triggerStreakReminders() {
    this.logger.log('Running streak reminder job...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usersWithStreak = await this.prisma.profile.findMany({
      where: {
        learningStreak: { gt: 0 },
      },
      include: { user: true },
    });

    for (const profile of usersWithStreak) {
      const attemptsToday = await this.prisma.quizAttempt.count({
        where: {
          userId: profile.userId,
          attemptDate: { gte: today },
        },
      });

      if (attemptsToday === 0) {
        await this.sendSmartNotification(
          profile.userId,
          'Keep your streak alive! 🔥',
          'Complete one quick lesson today to maintain your learning streak.',
          true,
        );
      }
    }
  }
}
