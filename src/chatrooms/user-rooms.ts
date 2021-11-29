import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
import { Room } from './chatrooms.model';


@Table({ tableName: 'user_rooms', createdAt: false, updatedAt: false })
export class UserRooms extends Model<UserRooms> {
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
	userId: number;

	@ApiProperty({ example: '12345678', description: 'ID комнаты' })
	@ForeignKey(() => Room)
	@Column({ type: DataType.INTEGER, onDelete: 'cascade' })
	roomId: number;
}
