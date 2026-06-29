import { Controller, Post, Body, Headers } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

class CreateOrderDto {
  userId: string;
  tier: 'Pro' | 'Elite';
}

class VerifyPaymentDto {
  userId: string;
  orderId: string;
  paymentId: string;
  signature: string;
  tier: 'Pro' | 'Elite';
}

@Controller('payments')
export class PaymentController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create-order')
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.subscriptionService.createCheckoutSession(dto.userId, dto.tier);
  }

  @Post('verify')
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.subscriptionService.verifyPaymentAndActivate(
      dto.userId,
      dto.orderId,
      dto.paymentId,
      dto.signature,
      dto.tier,
    );
  }

  @Post('webhook')
  async webhook(@Body() body: any, @Headers('x-razorpay-signature') signature: string) {
    return this.subscriptionService.handleWebhook(body, signature);
  }
}
