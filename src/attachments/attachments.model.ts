import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import * as Buffer from 'buffer';

interface AttachmentAddInterface {
  type: number;
  isPrivate: boolean;
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
    example: '<bin file>',
    description: 'тело файла',
  })
  @Column({
    type: DataType.BLOB,
    allowNull: true,
  })
  file: Buffer;
}
