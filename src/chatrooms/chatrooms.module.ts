import { Module } from '@nestjs/common';
import { ChatRoomsController } from './chatrooms.controller';
import { ChatRoomsService } from './chatrooms.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRooms } from './user-rooms';
import { Room } from './chatrooms.model';
import { User } from '../users/users.model';
import { ChatsService } from '../chats/chats.service';
import { Chat } from '../chats/chats.model';

@Module({
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService, ChatsService],
  imports: [
    SequelizeModule.forFeature([Room, User, UserRooms, Chat])
    ],
  exports: [ChatRoomsService]
})
export class ChatroomsModule {}
