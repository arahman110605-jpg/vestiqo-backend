import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

// Dynamic import for Razorpay to avoid build errors if not installed
let Razorpay: any;
try {
  Razorpay = require('razorpay');
} catch {
  Razorpay = null;
}

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  private readonly razorpay: any;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    if (Razorpay) {
      this.razorpay = new Razorpay({
        key_id: this.config.get<string>('RAZORPAY_KEY_ID'),
        key_secret: this.config.get<string>('RAZORPAY_KEY_SECRET'),
      });
    }
  }

  async createCheckoutSession(userId: string, tier: 'Pro' | 'Elite') {
    const amount = tier === 'Pro' ? 39900 : 89900; // Paise (₹399 / ₹899)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Fallback to mock if Razorpay not configured (dev mode)
    if (!this.razorpay) {
      this.logger.warn('Razorpay not configured — returning mock order');
      return { orderId: `order_mock_${Date.now()}`, amount, currency: 'INR' };
    }

    const order = await this.razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `vestiqo_${userId}_${Date.now()}`,
      notes: { userId, tier },
    });

    return { orderId: order.id, amount: order.amount, currency: order.currency };
  }

  async verifyPaymentAndActivate(
    userId: string,
    orderId: string,
    paymentId: string,
    signature: string,
    tier: 'Pro' | 'Elite',
  ) {
    const secret = this.config.get<string>('RAZORPAY_KEY_SECRET');

    // Signature verification
    if (secret && !orderId.startsWith('order_mock')) {
      const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (expectedSig !== signature) {
        throw new BadRequestException('Invalid payment signature');
      }
    }

    await this.prisma.subscription.upsert({
      where: { userId },
      update: { tier, status: 'Active', razorpayOrderId: orderId, updatedAt: new Date() },
      create: { userId, tier, status: 'Active', razorpayOrderId: orderId },
    });

    this.logger.log(`Activated ${tier} subscription for user ${userId}`);
    return { success: true, tier };
  }

  async handleWebhook(body: any, signature: string) {
    const secret = this.config.get<string>('RAZORPAY_WEBHOOK_SECRET');
    if (!secret) {
      this.logger.warn('Webhook secret not configured — skipping verification');
      return { received: true };
    }

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSig !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (body.event === 'payment.captured') {
      const { order_id, notes } = body.payload.payment.entity;
      if (notes?.userId && notes?.tier) {
        await this.prisma.subscription.upsert({
          where: { userId: notes.userId },
          update: { status: 'Active', razorpayOrderId: order_id, updatedAt: new Date() },
          create: { userId: notes.userId, tier: notes.tier, status: 'Active', razorpayOrderId: order_id },
        });
        this.logger.log(`Webhook activated subscription for ${notes.userId}`);
      }
    }

    return { received: true };
  }
}
