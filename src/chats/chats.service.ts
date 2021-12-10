import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './chats.model';
import { RoomUserDto } from './dto/chat.room-user';
import { ChatRoomsService } from '../chatrooms/chatrooms.service';

@Injectable()
export class ChatsService {
	constructor(
		@InjectModel(Chat)
		private repoChats: typeof Chat,
		private chatRoomService: ChatRoomsService
	) {}

	async joinRoom(roomId, userName, userId) {
		const dto = new RoomUserDto()
		dto['roomRef'] = roomId
		dto['userRef'] = userId
		dto['type'] = 'service'
		dto['message'] = 'User ' + userName + ' joined to room'
		return await this.repoChats.create(dto)
	}

	async msgToServer(mObj) {
		const dto = new RoomUserDto()
		dto['roomRef'] = mObj.roomId
		dto['userRef'] = mObj.userId
		dto['type'] = mObj.type
		dto['message'] = mObj.message
		return await this.repoChats.create(dto)
	}

	async uploadFile( roomId: number, userId: string, fileType: string, fileUrl: string ) {
		const dto = new RoomUserDto()
		dto['roomRef'] = roomId
		dto['userRef'] = parseInt(userId)
		dto['type'] = fileType
		dto['message'] = fileUrl
		await this.repoChats.create(dto);
		return fileUrl
	}
}
