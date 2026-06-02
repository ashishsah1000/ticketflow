import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { IssuesService } from '../issues/issues.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly issuesService: IssuesService,
  ) {}

  async processMessage(chatRequest: ChatRequestDto): Promise<ChatResponseDto> {
    const { message } = chatRequest;

    // 1. Understand intent
    const intent = await this.geminiService.understandIntent(message);

    const contextData: any = { intent: intent.action };

    // 2. Fulfill action via NestJS services
    if (intent.action === 'lookup_complaint') {
      const complaintId = intent.parameters?.complaint_id;
      if (complaintId) {
        // Extract alphanumeric in case they said "CMP12345"
        const cleanId = complaintId.replace(/[^a-zA-Z0-9]/g, '');
        let searchId = cleanId;
        if (cleanId.toUpperCase().startsWith('CMP')) {
            searchId = cleanId.substring(3);
        }
        
        try {
          const issue = await this.issuesService.findByTokenId(searchId);
          contextData.complaint = {
            id: searchId,
            status: issue.status,
            action: issue.action,
          };
        } catch (e) {
          contextData.error = 'not_found';
          contextData.complaintId = complaintId;
        }
      } else {
         contextData.missing_id = true;
      }
    }

    // 3. Generate response
    const finalResponse = await this.geminiService.generateResponse(message, contextData);

    return { response: finalResponse };
  }
}
