import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles';
import { RolesService } from '../roles/roles.service';
import { AuthModule } from '../auth/auth.module';
import { Attachment } from '../attachments/attachments.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RolesService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, Attachment]),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
