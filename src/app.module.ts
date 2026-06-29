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
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { LoggingModule } from './common/logger/logger.module';
import { RedisModule } from './redis/redis.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { SocialModule } from './social/social.module';
import { GamificationModule } from './gamification/gamification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    LoggingModule,
    ThrottlerModule.forRoot([
      {
        name: 'ip',
        ttl: 60000,
        limit: 30, // Max 30 requests per minute globally per IP
      },
      {
        name: 'user',
        ttl: 60000,
        limit: 60, // Max 60 requests per minute per authenticated user
      },
    ]),
    AuthModule, UserModule, LearningModule, MarketModule, SimulatorModule, AiModule, EnterpriseModule, SocialModule, GamificationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
