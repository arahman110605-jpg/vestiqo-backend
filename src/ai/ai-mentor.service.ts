import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiGatewayService } from './ai-gateway.service';

@Injectable()
export class AiMentorService {
  constructor(
    private readonly aiGateway: AiGatewayService,
    private readonly prisma: PrismaService,
  ) {}

  async getMentorResponse(userId: string, userMessage: string): Promise<string> {
    // 1. AI Memory Layer: Fetch user's recent weaknesses
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    
    // In a real scenario, we'd fetch failed quiz topics here
    const weakTopics = "Diversification, Bonds"; 
    
    const systemPrompt = `
      You are the Vestiqo AI Mentor. You teach finance simply and effectively.
      The user is at experience level: ${profile?.experienceLevel || 'Beginner'}.
      Note: This user has recently struggled with the following topics: ${weakTopics}.
      If relevant, gently weave in explanations relating to their weak topics.
      CRITICAL: Keep your answers SHORT, smart, and understandable in SIMPLE language. Avoid overwhelming the user with long paragraphs.
    `;

    // 2. Route through the safe AI Gateway
    const responseText = await this.aiGateway.generateResponse(systemPrompt, userMessage);

    // 3. Save conversation history
    await this.prisma.aiConversation.create({
      data: {
        userId,
        context: 'Mentor',
        messages: [{ role: 'user', content: userMessage }, { role: 'ai', content: responseText }]
      }
    });

    return responseText;
  }
}
