import { Module } from '@nestjs/common';
import { MsiService } from './msi.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Msi } from './msi.model';
import { Chat } from '../chats/chats.model';
import { MsiController } from './msi.controller';
import { User } from '../users/users.model';

@Module({
	controllers: [MsiController],
	providers: [MsiService],
	imports: [
		SequelizeModule.forFeature([Msi, Chat, User]),
		],
	exports: [MsiService],
})
export class MsiModule {}
