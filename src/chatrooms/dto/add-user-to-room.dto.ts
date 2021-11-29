import { ApiProperty } from '@nestjs/swagger';

export class AddUserToRoomDto {
	@ApiProperty({		example: '321',		description: 'Room ID'	})
	roomId: string;
	@ApiProperty({ example: '123', description: 'User ID' })
	userId: string;
}
