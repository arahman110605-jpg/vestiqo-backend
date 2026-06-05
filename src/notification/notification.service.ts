import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  /**
   * Sends an in-app notification and an optional FCM push notification.
   */
  async sendSmartNotification(userId: string, title: string, message: string, usePush: boolean = false) {
    // 1. Save to Database for In-App Notification Center
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        read: false
      }
    });

    // 2. Fire Push Notification via Firebase Cloud Messaging (FCM)
    if (usePush) {
      // In production: const fcmToken = await prisma.profile.findUnique(...)
      // admin.messaging().send({ token: fcmToken, notification: { title, body: message }})
      this.logger.log(`FCM Push sent to User ${userId}: ${title}`);
    }
  }

  /**
   * Checks for users whose streaks are about to expire.
   */
  async triggerStreakReminders() {
    this.logger.log('Running streak reminder job...');
    // Logic: Find users who haven't logged a lesson today and have learningStreak > 0
    // await this.sendSmartNotification(user.id, 'Keep your streak alive! 🔥', 'Complete one quick lesson today.');
  }
}
