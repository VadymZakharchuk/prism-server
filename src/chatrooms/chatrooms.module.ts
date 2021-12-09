import { Module } from '@nestjs/common';
import { ChatRoomsController } from './chatrooms.controller';
import { ChatRoomsService } from './chatrooms.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRooms } from './user-rooms';
import { Room } from './chatrooms.model';
import { User } from '../users/users.model';
import { Attachment } from '../attachments/attachments.model';

@Module({
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService],
  imports: [
    SequelizeModule.forFeature([Room, User, UserRooms, Attachment])
    ],
  exports: [ChatRoomsService]
})
export class ChatroomsModule {}
