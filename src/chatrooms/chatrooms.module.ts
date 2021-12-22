import { Module } from '@nestjs/common';
import { ChatRoomsController } from './chatrooms.controller';
import { ChatRoomsService } from './chatrooms.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRooms } from './user-rooms';
import { Room } from './chatrooms.model';
import { User } from '../users/users.model';
import { ChatsService } from '../chats/chats.service';
import { Chat } from '../chats/chats.model';
import { MsiService } from '../msi/msi.service';
import { Msi } from '../msi/msi.model';
import { SocketsService } from '../sockets/sockets.service';

@Module({
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService, ChatsService, MsiService, SocketsService],
  imports: [
    SequelizeModule.forFeature([Room, User, UserRooms, Chat, Msi])
    ],
  exports: [ChatRoomsService]
})
export class ChatroomsModule {}
