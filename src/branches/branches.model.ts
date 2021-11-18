import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { UserBranches } from './user-branches';
import { User } from '../users/users.model';


interface BranchCreationAttrs {
	name: string;
	settings: JSON;
}

@Table({ tableName: 'branches'})
export class Branch extends Model<Branch, BranchCreationAttrs> {

	@ApiProperty({example: '1', description: 'Уникальный идентификатор'})
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@ApiProperty({example: 'Золотой лотос', description: 'Название организации'})
	@Column({type: DataType.STRING(100), allowNull: false})
	name: string;

	@ApiProperty({example: 'JSON', description: 'JSON settings of branch'})
	@Column({type: DataType.JSON, allowNull: false})
	settings: JSON;

}
