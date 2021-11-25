import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {

	constructor(private pusherService: ChatService) {}
	@Post('/messages')
	async messages(
		@Body('username') username: string,
		@Body('message') message: string
	) {
		await this.pusherService.trigger('chat', 'message', {
			username,
			message
		})
		return 'message sent'
	}
}
