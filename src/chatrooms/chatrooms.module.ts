import { Module } from '@nestjs/common';
import { ChatRoomsController } from './chatrooms.controller';
import { ChatService } from './chatrooms.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRooms } from './user-rooms';
import { Room } from './chatrooms.model';
import { User } from '../users/users.model';
import { AttachmentsService } from '../attachments/attachments.service';
import { Attachment } from '../attachments/attachments.model';

@Module({
  controllers: [ChatRoomsController],
  providers: [ChatService, AttachmentsService],
  imports: [
    SequelizeModule.forFeature([Room, User, UserRooms, Attachment])
    ],
  exports: [ChatService]
})
export class ChatroomsModule {}
