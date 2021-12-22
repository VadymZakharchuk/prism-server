import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from './chats.model';
import { ChatRoomsService } from '../chatrooms/chatrooms.service';
import { Room } from '../chatrooms/chatrooms.model';
import { User } from '../users/users.model';
import { Msi } from '../msi/msi.model';
import { MsiService } from '../msi/msi.service';
import { SocketsService } from '../sockets/sockets.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatRoomsService, MsiService, SocketsService],
  imports: [
    SequelizeModule.forFeature([Chat, Room, User, Msi]),
    ],
  exports: [ChatsService],
})
export class ChatsModule {}
