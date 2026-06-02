import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GeminiService } from './gemini.service';
import { IssuesModule } from '../issues/issues.module';

@Module({
  imports: [IssuesModule],
  controllers: [ChatController],
  providers: [ChatService, GeminiService],
})
export class ChatModule {}
