import { ApiProperty } from '@nestjs/swagger';


export class CreateBranchDto {
	@ApiProperty({example: 'Золотой лотос', description: 'Название организации'})
	name: string;
	@ApiProperty({example: 'JSON', description: 'JSON settings of branch'})
	settings: JSON;
}
