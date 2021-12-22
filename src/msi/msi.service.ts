import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Msi } from './msi.model';
import { MsiCrudDto } from './dto/msi.crud-dto';
import { SocketsService } from '../sockets/sockets.service';

@Injectable()
export class MsiService {
	constructor(
		@InjectModel(Msi)
		private repoMsi: typeof Msi,
		private socketService: SocketsService
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
}
