import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ChatsService } from '../chats/chats.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from '../chats/chats.model';
import { ChatRoomsService } from '../chatrooms/chatrooms.service';
import { Room } from '../chatrooms/chatrooms.model';
import { MsiService } from '../msi/msi.service';
import { Msi } from '../msi/msi.model';
import { User } from '../users/users.model';
import { SocketsService } from './sockets.service';

@Module({
	controllers: [],
	providers: [SocketGateway, ChatsService, SocketsService, ChatRoomsService, MsiService],
	imports: [
		SequelizeModule.forFeature([Chat, Room, Msi, User])
		],
	exports: [SocketGateway]
})
export class SocketModule {}
