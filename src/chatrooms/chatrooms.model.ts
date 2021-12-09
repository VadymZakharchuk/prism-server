import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
import { UserRooms } from './user-rooms';

interface RoomCreationInterface {
  name: string;
  isPrivate: boolean;
}

@Table({ tableName: 'chat-rooms' })
export class Room extends Model<Room, RoomCreationInterface> {
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
    example: '123',
    description: 'ID собственника комнаты',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  owner: number;

  @ApiProperty({
    example: 'Еженедельное совещание',
    description: 'Название комнаты',
  })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  name: string;

  @ApiProperty({
    example: 'true / false',
    description: 'Приватность комнаты',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isPrivate: boolean;

  @ApiProperty({
    example: '<ссылка на аватар>',
    description: 'Ссылка на аватар',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar: string;

  @ApiProperty({
      example: 'eb4b81d3ab6583195f723631',
    description: 'Код комнаты',
  })
  @Column({
    type: DataType.STRING(25),
    allowNull: false,
  })
  code: string;

  @BelongsToMany(() => User, () => UserRooms)
  users: User[]
}
