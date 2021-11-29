import { ApiProperty } from '@nestjs/swagger';

export class DelUserFromRoomDto {
	@ApiProperty({		example: '321',		description: 'Room ID'	})
	roomId: string;
	@ApiProperty({ example: '123', description: 'User ID' })
	userId: string;
}
