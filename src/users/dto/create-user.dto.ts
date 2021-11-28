import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Адрес электронной почты',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Не корректный EMail' })
  email: string;
  @ApiProperty({ example: '12345678', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(6, 14, { message: 'Длина пароля неменее 6 и не более 14 символов' })
  password: string;
}
