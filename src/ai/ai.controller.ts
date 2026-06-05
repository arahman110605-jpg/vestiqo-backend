import { Controller, Post, Body } from '@nestjs/common';
import { AiMentorService } from './ai-mentor.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiMentorService: AiMentorService) {}

  @Post('chat')
  async chatWithMentor(@Body() body: { userId: string; message: string }) {
    if (!body.userId || !body.message) {
      throw new Error('userId and message are required');
    }

    const response = await this.aiMentorService.getMentorResponse(body.userId, body.message);
    return { response };
  }
}
