import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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

	@ApiOperation({ summary: 'Update данных комнаты по ID' })
	@ApiResponse({ status: 200, type: Room })
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

	@ApiOperation({ summary: 'Удалить комнату по ID' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Delete('/:roomId')
	removeRoom(@Param('roomId') roomId: string ) {
		return this.chatService.removeRoom(roomId)
	}

	@ApiOperation({ summary: 'Получить список всех комнат' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Get('/list')
	listRooms(@TokenGetUserID() userId: string, @Body() body){
		if (body.mylist) {
			return this.chatService.listMyRooms(userId)
		} else {
			return this.chatService.listRooms()
		}
	}

	@ApiOperation({ summary: 'Получить список участников комнаты' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Get('/:roomId')
	listRoomMembers(@Param('roomId') roomId: string){
		return this.chatService.listRoomMembers(roomId)
	}
}
