import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiGatewayService {
  private readonly logger = new Logger(AiGatewayService.name);
  private openai: OpenAI;

  constructor() {
    // Initialize OpenAI SDK
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'development-key' });
  }

  /**
   * Core routing method for all AI calls. Enforces guardrails and handles errors.
   */
  async generateResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      // 1. Enforce Finance Guardrails (Pre-processing)
      const safetySystemInstruction = `
        ${systemPrompt}
        
        CRITICAL FINANCE GUARDRAILS:
        1. You are an educational AI. You MUST NOT provide personalized investment advice.
        2. You MUST NOT predict stock prices or guarantee returns.
        3. If the user asks for stock tips, you must decline and instead explain how to analyze the stock.
        4. Always maintain a beginner-friendly, educational tone.
      `;

      // 2. Call OpenAI GPT-4o-Mini
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: safetySystemInstruction },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2, // Low temperature for factual consistency
      });

      // 3. Logging (Post-processing)
      this.logger.log(`AI Call successful. User Prompt length: ${userPrompt.length}`);
      
      return response.choices[0]?.message?.content ?? '';
    } catch (error) {
      this.logger.error('Failed to generate AI response', error);
      throw new HttpException('AI Service is currently unavailable.', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
