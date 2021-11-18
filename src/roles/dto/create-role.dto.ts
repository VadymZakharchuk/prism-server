import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
  @ApiProperty({example: 'ADMIN', description: 'Название роли пользователя'})
  value: string;
  @ApiProperty({example: 'Администратор системы', description: 'Описание роли пользователя'})
  description: string;
}
