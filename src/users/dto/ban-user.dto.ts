import { ApiProperty } from "@nestjs/swagger";


export class BanUserDto {
  @ApiProperty({example: '12345', description: 'ID пользователя'})
  userId: number
  @ApiProperty({example: 'Распространение спама', description: 'Описание причины бана пользователя'})
  banReason: string
}
