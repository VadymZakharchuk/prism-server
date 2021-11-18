import { ApiProperty } from "@nestjs/swagger";

export class AddRoleDto {
  @ApiProperty({example: 'ADMIN', description: 'Наименование роли'})
  value: string
  @ApiProperty({example: '12345', description: 'ID пользователя'})
  userId: number
}
