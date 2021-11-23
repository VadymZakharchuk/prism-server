import { ApiProperty } from "@nestjs/swagger";

export class SetNewPasswordDto {
	@ApiProperty({example: '123456', description: 'Код верификации'})
	verifyCode: string
	@ApiProperty({example: '1234567', description: 'Новый пароль'})
	password: string
	@ApiProperty({example: 'one@two.com', description: 'EMail пользователя'})
	email: string
}
