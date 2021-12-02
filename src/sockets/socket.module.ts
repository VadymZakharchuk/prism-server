import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ChatAlertController } from '../chat-alert/chat-alert.controller';
import { ChatAlertGateway } from '../chat-alert/chat-alert.gateway';


@Module({
	controllers: [ChatAlertController],
	providers: [SocketGateway, ChatAlertGateway],
})
export class SocketModule {}
