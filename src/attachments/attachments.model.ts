import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import * as Buffer from 'buffer';

interface AttachmentAddInterface {
  mimetype: string;
  ownerId: number;
  file: Buffer;
}

@Table({ tableName: 'attachments' })
export class Attachment extends Model<Attachment, AttachmentAddInterface> {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'File mimetype',
  })
  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  mimetype: string;

  @ApiProperty({
    example: '<owner Id>',
    description: 'ID собственника файла',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  ownerId: number;

  @ApiProperty({
    example: '<bin file>',
    description: 'тело файла',
  })
  @Column({
    type: DataType.BLOB,
    allowNull: true,
  })
  file: Buffer;
}
