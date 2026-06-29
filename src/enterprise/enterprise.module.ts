import { Module } from '@nestjs/common';
import { B2bService } from './b2b.service';
import { CertificationService } from './certification.service';
import { SubscriptionService } from './subscription.service';
import { PaymentController } from './payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [B2bService, CertificationService, SubscriptionService],
  exports: [B2bService, CertificationService, SubscriptionService],
})
export class EnterpriseModule {}
