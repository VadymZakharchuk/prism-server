import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './chatrooms.model';
import { CreateRoomDto } from './dto/create-room.dto';
import { AddUserToRoomDto } from './dto/add-user-to-room.dto';
import { DelUserFromRoomDto } from './dto/del-user-from-room.dto';
import { AttachmentsService } from '../attachments/attachments.service';
import { User } from '../users/users.model';
import { where } from 'sequelize';

@Injectable()
export class ChatService {
	constructor(
		@InjectModel(Room)
		private repoChatRooms: typeof Room,
		private attachmentsService: AttachmentsService,
	) {}

	async createRoom(dto: CreateRoomDto, ownerId: string) {
		dto['owner'] = ownerId
		const room =  await this.repoChatRooms.create(dto)
		await room.$add('user', ownerId)
		return room
	}
	async getRoomById(roomId: string) {
		return await this.repoChatRooms.findByPk(roomId)
	}
	async addUserToRoom (dto: AddUserToRoomDto) {
		const room = await this.getRoomById(dto.roomId)
		return await room.$add('user', dto.userId)
	}
	async removeUserFromRoom (dto: DelUserFromRoomDto) {
		const room = await this.getRoomById(dto.roomId)
		return await room.$remove('user', dto.userId)
	}
	async updateRoom(roomId, file ,body){
		const room = await this.getRoomById(roomId)
		const params = body
		if (file !== undefined) {
			params.avatar = await this.attachmentsService.createAttachment({
				mimetype: body.mimetype,
				ownerId: room.owner,
				file: file,
			});
		}
		const fields = Object.keys(params);
		return await room.update(params, { fields: fields });
	}

	async removeRoom(roomId){
		await this.repoChatRooms.destroy(
			{ where: { id: roomId }
		})
	}

	async listMyRooms(userId: string) {
		const res =  await this.repoChatRooms.findAll({
			include: [{
				model: User,
				through: {
					where: { userId: userId }
				}
			}]
		})
		return res.filter( room => room.users.length > 0)
	}

	async listRooms() {
		const res =  await this.repoChatRooms.findAll({
			include: { all: true }
		})
		return res.filter( room => room.users.length > 0)
	}

	async listRoomMembers(roomId: string) {
		return await this.repoChatRooms.findAll({
			where: { id: roomId },
			include: { all: true }
		})
	}
}
