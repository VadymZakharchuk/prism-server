import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
	@ApiProperty({example: 'one@to.com', description: 'Email'})
	email: string
}
