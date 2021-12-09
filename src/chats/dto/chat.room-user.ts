import { ApiProperty } from '@nestjs/swagger';

export class RoomUserDto {
	@ApiProperty({	example: '40e83fc287f88459a222ee93', description: 'Код комнаты' })
	roomRef: number;
	@ApiProperty({ example: '123', description: 'ID пользователя' })
	userRef: number;
	@ApiProperty({ example: 'text', description: 'тип сообщения' })
	type: string;
	@ApiProperty({ example: 'text', description: 'текст сообщения' })
	message: string;
}
