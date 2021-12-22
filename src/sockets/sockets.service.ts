import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';

@Injectable()
export class SocketsService {
	constructor(
		@InjectModel(User)
		private repoUser: typeof User
	){}

	async setUserStatus( userId: string, status: boolean) {
		const user = await this.repoUser.findByPk(parseInt(userId));
		user.is_online = status;
		await user.save();
		return user;
	}
	async isUserOnline (userId: string) {
		const user = await this.repoUser.findByPk(parseInt(userId));
		return user.is_online;
	}
}
