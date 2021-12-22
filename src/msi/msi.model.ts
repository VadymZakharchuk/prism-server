import { BelongsTo, Column, DataType, Default, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Chat } from '../chats/chats.model';
import { User } from '../users/users.model';

interface MsiCrudInterface {
	userRef: number;
	chatRef: number;
	roomRef: number;
	isDelivered: boolean;
	isRead: boolean;
}

@Table({ tableName: 'msi', createdAt: false, updatedAt: false })
export class Msi extends Model<Msi, MsiCrudInterface> {
	@ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
	@Column({
		type: DataType.INTEGER,
		unique: true,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@ApiProperty({ example: '12345678', description: 'ID пользователя' })
	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER, onDelete: 'cascade' })
	userRef: number;
	@BelongsTo(() => User)
	user: User

	@ApiProperty({ example: '12345678', description: 'ID сообщения комнаты чата' })
	@ForeignKey(() => Chat)
	@Column({ type: DataType.INTEGER, onDelete: 'cascade' })
	chatRef: number;
	@BelongsTo(() => Chat)
	chat: Chat

	@ApiProperty({ example: '12345678', description: 'ID комнаты' })
	@Column({ type: DataType.INTEGER })
	roomRef: number;

	@ApiProperty({ example: 'true/false', description: 'Статус доставки сообщения' })
	@Default(false)
	@Column({ type: DataType.BOOLEAN	})
	isDelivered: boolean;

	@ApiProperty({ example: 'true/false', description: 'Статус прочтения сообщения' })
	@Default(false)
	@Column({ type: DataType.BOOLEAN	})
	isRead: boolean;
}
