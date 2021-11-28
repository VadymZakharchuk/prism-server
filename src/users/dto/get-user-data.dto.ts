import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUserDataDto {
  @ApiProperty({ example: '123', description: 'ID пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  userId: string;
}
