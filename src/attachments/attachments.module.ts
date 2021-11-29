import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles';
import { Attachment } from './attachments.model';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
  imports: [
    SequelizeModule.forFeature([Attachment])
  ]
})
export class AttachmentsModule {}
