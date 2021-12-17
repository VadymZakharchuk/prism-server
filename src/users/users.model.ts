import {
  BelongsToMany,
  Column,
  DataType, HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../roles/user-roles';
import { Role } from '../roles/roles.model';
import { Room } from '../chatrooms/chatrooms.model';
import { UserRooms } from '../chatrooms/user-rooms';
import { Chat } from '../chats/chats.model';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Иванов Иван Иванович',
    description: 'Фамилия, имя, отчество',
  })
  @Column({ type: DataType.STRING(100), allowNull: true })
  name: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: 'Адрес электронной почты',
  })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  email: string;

  @ApiProperty({
    example: '+7(095)111-2233',
    description: 'Телефон пользователя',
  })
  @Column({ type: DataType.STRING(20), unique: true, allowNull: true })
  phone: string;

  @ApiProperty({
    example: '@telegramNick',
    description: 'Телеграм пользователя',
  })
  @Column({ type: DataType.STRING(20), unique: true, allowNull: true })
  telegram_id: string;

  @ApiProperty({ example: '12345678', description: 'Пароль' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: 'true', description: 'Телефон подтвержден или нет' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  phone_confirmed: boolean;

  @ApiProperty({ example: 'true', description: 'EMail подтвержден или нет' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  email_confirmed: boolean;

  @ApiProperty({ example: 'true', description: 'Забанен или нет' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @ApiProperty({
    example: 'Болезнь, отпуск т.п.',
    description: 'Причина блокировки',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  banReason: string;

  @ApiProperty({ example: 'refreshToken', description: 'refreshToken' })
  @Column({ type: DataType.STRING(300), allowNull: true })
  rt: string;

  @ApiProperty({
    example: 'http://domain<path>filename',
    description: 'ссылка на аватар пользователя',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  avatar: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @BelongsToMany(() => Room, () => UserRooms)
  rooms: Room[];

  @HasMany(() => Chat)
  chats: Chat[]
}
