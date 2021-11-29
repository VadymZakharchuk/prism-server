import { ApiProperty } from '@nestjs/swagger';

export class AttachmentAddDto {
  @ApiProperty({
    example: 'image/jpeg',
    description: 'Mime type файла',
  })
  mimetype: string;
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
