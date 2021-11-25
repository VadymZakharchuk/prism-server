import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { BranchesModule } from './branches/branches.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles';
import { User } from './users/users.model';
import { Branch } from './branches/branches.model';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PSWD,
      database: process.env.DB_NAME,
      models: [User, Role, UserRoles, Branch],
      autoLoadModels: true
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    BranchesModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class AppModule {}
