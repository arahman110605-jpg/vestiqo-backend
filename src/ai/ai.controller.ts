import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AiMentorService } from './ai-mentor.service';
import { ChatDto } from './dto/chat.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiMentorService: AiMentorService) {}

  @Post('chat')
  @Throttle(10, 60) // Max 10 AI messages per minute per user
  async chatWithMentor(@Body() dto: ChatDto) {
    const response = await this.aiMentorService.getMentorResponse(dto.userId, dto.message);
    return { response };
  }
}
