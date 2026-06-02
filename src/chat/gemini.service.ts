import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { INTENT_PROMPT } from './prompts/intent.prompt';
import { RESPONSE_PROMPT } from './prompts/response.prompt';
import { ChatIntent } from './interfaces/chat-intent.interface';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private readonly logger = new Logger(GeminiService.name);

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async understandIntent(message: string): Promise<ChatIntent> {
    const prompt = `${INTENT_PROMPT}\n\nUser Message: "${message}"`;
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      });
      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (e) {
      this.logger.error('Failed to understand intent', e);
      return { action: 'unknown' };
    }
  }

  async generateResponse(message: string, context: any): Promise<string> {
    const prompt = `${RESPONSE_PROMPT}\n${JSON.stringify(context, null, 2)}\n\nUser Message: "${message}"`;
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      this.logger.error('Failed to generate response', e);
      return 'I am sorry, I am currently experiencing technical difficulties. Please try again later.';
    }
  }
}
