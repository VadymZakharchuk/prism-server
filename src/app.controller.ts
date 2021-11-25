import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
