import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './chats.model';
import { RoomUserDto } from './dto/chat.room-user';
import { ChatRoomsService } from '../chatrooms/chatrooms.service';
import sequelize, { Op } from 'sequelize';
import { User } from '../users/users.model';

@Injectable()
export class ChatsService {
	constructor(
		@InjectModel(Chat)
		private repoChats: typeof Chat,
		private chatRoomService: ChatRoomsService
	) {}

	async joinRoom(roomId, userName, userId) {
		const listRoomUsers = await this.chatRoomService.listRoomMembers(roomId)
		const isJoinAllowed = listRoomUsers.find((user) => user.id === userId)
		if (!isJoinAllowed) return false
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
		dto['userRef'] = mObj.user.id
		dto['type'] = mObj.type
		dto['message'] = mObj.message
		return await this.repoChats.create(dto)
	}

	async listRoomMessages (roomId, pageNo, count) {
		const conditions = {
			[Op.and]: [
				{ roomRef: roomId },
				{	type: { [Op.ne]: 'service' }}
			]
		}
		const countRec = await this.repoChats.count({
			where: conditions
		})
		const offsetRec = parseInt(pageNo) * parseInt(count)
		return {
			totalRec: countRec,
			content: await this.repoChats.findAll({
				where: conditions,
				offset: offsetRec,
				limit: parseInt(count),
				order: [['updatedAt', 'DESC']],
				attributes: [ 'id', 'roomRef', 'userRef', 'type', 'message',
					[sequelize.fn('UNIX_TIMESTAMP', sequelize.col('Chat.createdAt')), 'ets']
				],
				include: [{
					model: User,
					attributes:  ['id','name', 'phone', 'telegram_id']
				}]
			})
		}
	}
}
