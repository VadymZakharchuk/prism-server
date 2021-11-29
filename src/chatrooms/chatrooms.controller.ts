import { Body, Controller, Delete, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chatrooms.service';
import { Room } from './chatrooms.model';
import { CreateRoomDto } from './dto/create-room.dto';
import { TokenGetUserID } from '../decorators/TokenGetUserID';
import { IsUserAuth } from '../guards/is-auth.guard';
import { AddUserToRoomDto } from './dto/add-user-to-room.dto';
import { DelUserFromRoomDto } from './dto/del-user-from-room.dto';
import { User } from '../users/users.model';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('table Chat Rooms')
@Controller('chat')
export class ChatRoomsController {
	constructor(private chatService: ChatService) {}

	@ApiOperation({ summary: 'Создание комнаты чата' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Post()
	createRoom(@Body() dto:CreateRoomDto, @TokenGetUserID() userId: string){
		return this.chatService.createRoom(dto, userId)
	}

	@ApiOperation({ summary: 'Добавить участника в комнату' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Post('/add-user/')
	addUserToRoom(@Body() dto: AddUserToRoomDto) {
		return this.chatService.addUserToRoom(dto)
	}

	@ApiOperation({ summary: 'Удалить участника из комнаты' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Post('/del-user/')
	removeUserFromRoom(@Body() dto: DelUserFromRoomDto) {
		return this.chatService.removeUserFromRoom(dto)
	}

	@ApiOperation({ summary: 'Update данных пользователя по ID' })
	@ApiResponse({ status: 200, type: [User] })
	@UseGuards(IsUserAuth)
	@Post('/:roomId')
	@UseInterceptors(FileInterceptor('file'))
	updateRoomById(
		@Param('roomId') roomId: string,
		@UploadedFile() file,
		@Body() body,
	) {
		return this.chatService.updateRoom(roomId, file ,body)
	}

	@ApiOperation({ summary: 'Update данных пользователя по ID' })
	@ApiResponse({ status: 200, type: [User] })
	@UseGuards(IsUserAuth)
	@Delete('/:roomId')
	removeRoom(@Param('roomId') roomId: string ) {
		return this.chatService.removeRoom(roomId)
	}
}
