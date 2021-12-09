import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ChatsService } from '../chats/chats.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from '../chats/chats.model';
import { ChatRoomsService } from '../chatrooms/chatrooms.service';
import { Room } from '../chatrooms/chatrooms.model';

@Module({
	controllers: [],
	providers: [SocketGateway, ChatsService, ChatRoomsService],
	imports: [
		SequelizeModule.forFeature([Chat, Room])
		],
	exports: [SocketGateway]
})
export class SocketModule {}
