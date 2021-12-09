import { Body, Controller, Delete, Get, Res, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatRoomsService } from './chatrooms.service';
import { Room } from './chatrooms.model';
import { CreateRoomDto } from './dto/create-room.dto';
import { TokenGetUserID } from '../decorators/TokenGetUserID';
import { IsUserAuth } from '../guards/is-auth.guard';
import { AddUserToRoomDto } from './dto/add-user-to-room.dto';
import { DelUserFromRoomDto } from './dto/del-user-from-room.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from  'path';
import { getRandomFileName, HandleStaticPath } from '../decorators/StaticFilesHandling';


@ApiTags('table Chat Rooms')
@Controller('chat')
export class ChatRoomsController {
	constructor(private chatRoomsService: ChatRoomsService) {}

	@ApiOperation({ summary: 'Создание комнаты чата' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Post()
	async createRoom(@Body() dto:CreateRoomDto, @TokenGetUserID() userId: string){
		const room = await this.chatRoomsService.createRoom(dto, userId)
		let path = `./public/rooms/${room.id}`;
		HandleStaticPath(path, { recursive: true }, err => { if (err) throw err })
		return room
	}

	@ApiOperation({ summary: 'Добавить участника в комнату' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Post('/add-user/')
	addUserToRoom(@Body() dto: AddUserToRoomDto) {
		return this.chatRoomsService.addUserToRoom(dto)
	}

	@ApiOperation({ summary: 'Удалить участника из комнаты' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Post('/del-user/')
	removeUserFromRoom(@Body() dto: DelUserFromRoomDto) {
		return this.chatRoomsService.removeUserFromRoom(dto)
	}

	@ApiOperation({ summary: 'Update данных комнаты по ID' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Post('/:roomId')
	@UseInterceptors(FileInterceptor('file',
		{
				storage: diskStorage({
					destination: (req, file, callback) => {
						let path = `./public/rooms/${req.params.roomId}/avatars`;
						HandleStaticPath(path, { recursive: true }, err => { if (err) throw err })
						callback(null, path);
					},
					filename: (req, file, cb) => {
						return cb(null, `${getRandomFileName()}${extname(file.originalname)}`)
					}
				})
			}
		))
	updateRoomById(
		@Param('roomId') roomId: string,
		@UploadedFile() file,
		@Body() body,
	) {
		return this.chatRoomsService.updateRoom(
			roomId,
			file ,
			body,
			`http://${process.env.DB_HOST}:${process.env.APP_PORT}/chat/${file.path}`)
	}

	@ApiOperation({ summary: 'Установить аватар комнаты по roomID' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Post('/:roomId/avatar')
	@UseInterceptors(FileInterceptor('file',
		{
			storage: diskStorage({
				destination: (req, file, callback) => {
					let path = `./public/rooms/${req.params.roomId}/avatars`;
					HandleStaticPath(path, { recursive: true }, err => { if (err) throw err })
					callback(null, path);
				},
				filename: (req, file, cb) => {
					return cb(null, `${getRandomFileName()}${extname(file.originalname)}`)
				}
			})
		}
	))
	uploadAvatar(@Param('roomId') roomId, @UploadedFile() file) {
		return this.chatRoomsService.setAvatar(
			roomId,
			`http://${process.env.DB_HOST}:${process.env.APP_PORT}/chat/${file.path}`);
	}

	@ApiOperation({ summary: 'Получить аватар комнаты по имени' })
	@ApiResponse({ status: 200, type: Room })
	@Get('public/rooms/:roomId/avatars/:fileId')
	async serveAvatar(
		@Param('roomId') roomId,
		@Param('fileId') fileId,
		@Res() res): Promise<any> {
		res.sendFile(fileId, { root: `public/rooms/${roomId}/avatars`});
	}

	@ApiOperation({ summary: 'Удалить комнату по ID' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Delete('/:roomId')
	removeRoom(@Param('roomId') roomId: string ) {
		return this.chatRoomsService.removeRoom(roomId)
	}

	@ApiOperation({ summary: 'Получить список всех комнат' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Get('/list')
	listRooms(@TokenGetUserID() userId: string, @Body() body){
		if (body.mylist) {
			return this.chatRoomsService.listMyRooms(userId)
		} else {
			return this.chatRoomsService.listRooms()
		}
	}

	@ApiOperation({ summary: 'Получить список участников комнаты' })
	@ApiResponse({ status: 200, type: Room })
	@UseGuards(IsUserAuth)
	@Get('/:roomId')
	listRoomMembers(@Param('roomId') roomId: string){
		return this.chatRoomsService.listRoomMembers(roomId)
	}
}
