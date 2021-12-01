import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomDto {
  @ApiProperty({
    example: 'Еженедельное совещание',
    description: 'Название комнаты',
  })
  name: string;
  @ApiProperty({
    example: 'true / false',
    description: 'Приватность комнаты',
  })
  isPrivate: boolean;
  @ApiProperty({
    example: '<ref to avatar>',
    description: 'Ссылка на аватар комнаты',
  })
  avatar: string;
}
