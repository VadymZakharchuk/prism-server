import { ApiProperty } from '@nestjs/swagger';

export class MsiCrudDto {
	@ApiProperty({ example: '123', description: 'ID пользователя' })
	userRef: number;
	@ApiProperty({	example: '123', description: 'ID сообщения в таблице Chat' })
	chatRef: number;
	@ApiProperty({	example: '123', description: 'ID комнаты' })
	roomRef: number;
	@ApiProperty({ example: 'true', description: 'Сообщение доставлено пользователю userRef' })
	isDelivered: boolean;
	@ApiProperty({ example: 'false', description: 'Сообщение прочитано пользователем userRef' })
	isRead: boolean;
}
