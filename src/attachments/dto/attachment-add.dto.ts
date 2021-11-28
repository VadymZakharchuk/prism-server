import { ApiProperty } from '@nestjs/swagger';

export class AttachmentAddDto {
  @ApiProperty({
    example: '1',
    description: 'Тип 1=image, 2=video, 3=file, 4=sound',
  })
  type: number;
  @ApiProperty({
    example: '123',
    description: 'ID собственника файла',
  })
  ownerId: number;
  @ApiProperty({
    example: 'bin file',
    description: 'файл',
  })
  file: Buffer;
}
