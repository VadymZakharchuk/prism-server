import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Attachment } from '../attachments/attachments.model';

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
  @ForeignKey(() => Attachment)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  avatar: number;
}
