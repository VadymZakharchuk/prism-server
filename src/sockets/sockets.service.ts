import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { Room } from '../chatrooms/chatrooms.model';
import { MsiService } from '../msi/msi.service';

@Injectable()
export class SocketsService {
	constructor(
		@InjectModel(User)
		private repoUser: typeof User,
		private msiService: MsiService
	){}

	async setUserStatus( userId: string, status: boolean) {
		const user = await this.repoUser.findOne({
			where: { id: parseInt(userId) },
			include: [
				{ model: Room,
					attributes: ['id', 'owner', 'name'],
				}
			]
		})
		user.is_online = status;
		await user.save();
		return user;
	}

	async getUnreadMesCount (userId, roomList) {
		const tempArr = await this.msiService.notifyUnreadMessages(userId, roomList);
		return tempArr.filter( item => item['unReadMesCount'] > 0);
	}

	async isUserOnline (userId: string) {
		const user = await this.repoUser.findByPk(parseInt(userId));
		return user.is_online;
	}
}
