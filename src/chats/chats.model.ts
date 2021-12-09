import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Room } from '../chatrooms/chatrooms.model';
import { User } from '../users/users.model';

interface ChatCreationInterface {
	roomRef: number;
	userRef: number;
	type: string;
	message: string;
}

@Table({ tableName: 'chats' })
export class Chat extends Model<Chat, ChatCreationInterface> {
	@ApiProperty({
		example: '1',
		description: 'Уникальный идентификатор',
	})
	@Column({
		type: DataType.INTEGER,
		unique: true,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@ApiProperty({
		example: '12',
		description: 'ID комнаты',
	})
	@ForeignKey(() => Room)
	@Column({
		type: DataType.INTEGER(),
		allowNull: false,
	})
	roomRef: number;

	@ApiProperty({
		example: '123',
		description: 'ID автора сообщения',
	})
	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER(),
		allowNull: false,
	})
	userRef: number;

	@ApiProperty({
		example: 'text / image / video / sound / file / other / service',
		description: 'Тип сообщения',
	})
	@Column({
		type: DataType.STRING(7),
		allowNull: false,
	})
	type: string;

	@ApiProperty({
		example: ' Hello world (text) or http://domain.com/chat/room/filename (image/video/sound/file/other',
		description: 'Текст сообщения или ссылка на медиаресурс',
	})
	@Column({
		type: DataType.STRING(255),
		allowNull: false,
	})
	message: string;
}
