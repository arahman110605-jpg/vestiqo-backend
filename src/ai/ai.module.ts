import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiMentorService } from './ai-mentor.service';
import { AiGatewayService } from './ai-gateway.service';

@Module({
  controllers: [AiController],
  providers: [AiMentorService, AiGatewayService],
  exports: [AiMentorService],
})
export class AiModule {}
