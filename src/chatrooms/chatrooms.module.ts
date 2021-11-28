import { Module } from '@nestjs/common';
import { ChatroomsController } from './chatrooms.controller';
import { ChatroomsService } from './chatrooms.service';

@Module({
  controllers: [ChatroomsController],
  providers: [ChatroomsService],
})
export class ChatroomsModule {}
