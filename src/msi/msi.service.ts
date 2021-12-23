import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Msi } from './msi.model';
import { MsiCrudDto } from './dto/msi.crud-dto';
import sequelize, { Op } from 'sequelize';

@Injectable()
export class MsiService {
	constructor(
		@InjectModel(Msi)
		private repoMsi: typeof Msi
	){}

	async createMsi (msgId, arrUsers, authorId, roomId) {
		const dto = new MsiCrudDto()
		await arrUsers.map( async (user) => {
			if (authorId !== user.id) {
				// const isUserOn = await this.socketService.isUserOnline(user.id)
				dto['userRef'] = user.id
				dto['chatRef'] = msgId
				dto['roomRef'] = roomId
				dto['isDelivered'] = true
				dto['isRead'] = false
				await this.repoMsi.create(dto);
			}
		})
	}
	async notifyUnreadMessages(userId, roomList){
		return await Promise.all(roomList.map(async (room) => {
			let temp = await this.repoMsi.findAll({
				attributes: [
					'roomRef',
					[sequelize.fn('COUNT', sequelize.col('Msi.chatRef')), 'unReadMesCount']
				],
				where: {
					[Op.and]: [
						{ userRef: userId },
						{ isRead: false },
						{ roomRef: room.id }
					]
				}
			})
			return temp[0]['dataValues']
		}))
	}
}
