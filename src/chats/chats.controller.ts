import { Controller, Post, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat } from './chats.model'
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsUserAuth } from '../guards/is-auth.guard';

@Controller('chat/room')
export class ChatsController {
	constructor(private chatsService: ChatsService) {}

	@ApiOperation({ summary: 'Юзер вошел в комнату' })
	@ApiResponse({ status: 200, type: Chat })
	@UseGuards(IsUserAuth)
	@Post()
	async joinRoom(){}
}
