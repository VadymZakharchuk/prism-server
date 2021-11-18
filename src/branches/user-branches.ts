import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
import { Branch } from './branches.model';


@Table({ tableName: 'user_branches', createdAt: false, updatedAt: false})
export class UserBranches extends Model<UserBranches> {

	@ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
	@Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
	id: number;

	@ApiProperty({ example: '12345678', description: 'ID пользователя' })
	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER })
	userId: number;

	@ApiProperty({ example: '12345678', description: 'ID организации' })
	@ForeignKey(() => Branch)
	@Column({ type: DataType.INTEGER })
	roleId: number;

}
