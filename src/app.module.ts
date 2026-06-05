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

@Module({
  imports: [AuthModule, UserModule, LearningModule, MarketModule, SimulatorModule, AiModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
