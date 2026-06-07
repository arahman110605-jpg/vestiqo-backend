import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LearningModule } from './learning/learning.module';
import { MarketModule } from './market/market.module';
import { SimulatorModule } from './simulator/simulator.module';
import { AiModule } from './ai/ai.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 30, // Max 30 requests per minute globally per IP
    }]),
    AuthModule, UserModule, LearningModule, MarketModule, SimulatorModule, AiModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
