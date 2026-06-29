import { Injectable, Logger, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_CLIENT } from '../redis/redis.module';
import OpenAI from 'openai';
import * as crypto from 'crypto';

@Injectable()
export class AiGatewayService {
  private readonly logger = new Logger(AiGatewayService.name);
  private openai: OpenAI;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: ReturnType<typeof createClient> | null,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'development-key' });
  }

  async generateResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    const cacheKey = `ai:cache:${crypto.createHash('sha256').update(systemPrompt + userPrompt).digest('hex')}`;

    // 1. Check Redis cache
    if (this.redis) {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          this.logger.log('AI cache hit');
          return JSON.parse(cached);
        }
      } catch (err) {
        this.logger.warn('Redis cache read failed: ' + err.message);
      }
    }

    try {
      const safetySystemInstruction = `
        ${systemPrompt}
        
        CRITICAL FINANCE GUARDRAILS:
        1. You are an educational AI. You MUST NOT provide personalized investment advice.
        2. You MUST NOT predict stock prices or guarantee returns.
        3. If the user asks for stock tips, you must decline and instead explain how to analyze the stock.
        4. Always maintain a beginner-friendly, educational tone.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: safetySystemInstruction },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content ?? '';
      this.logger.log(`AI Call successful. User Prompt length: ${userPrompt.length}`);

      // 2. Cache the response
      if (this.redis && content) {
        try {
          await this.redis.setEx(cacheKey, 3600, JSON.stringify(content)); // 1 hour TTL
        } catch (err) {
          this.logger.warn('Redis cache write failed: ' + err.message);
        }
      }

      return content;
    } catch (error) {
      this.logger.error('Failed to generate AI response', error);
      throw new HttpException('AI Service is currently unavailable.', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
