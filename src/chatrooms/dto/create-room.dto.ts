import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    example: 'Еженедельное совещание',
    description: 'Название комнаты',
  })
  name: string;
  @ApiProperty({ example: 'true / false', description: 'Приватность комнаты' })
  isPrivate: boolean;
}
