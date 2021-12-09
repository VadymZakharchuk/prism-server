import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from './chats.model';
import { ChatRoomsService } from '../chatrooms/chatrooms.service';
import { Room } from '../chatrooms/chatrooms.model';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatRoomsService],
  imports: [
    SequelizeModule.forFeature([Chat, Room]),
    ],
  exports: [ChatsService],
})
export class ChatsModule {}
