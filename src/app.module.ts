import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { BranchesModule } from './branches/branches.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles';
import { User } from './users/users.model';
import { Branch } from './branches/branches.model';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './sockets/socket.module';
import { ChatsModule } from './chats/chats.module';
import { ChatroomsModule } from './chatrooms/chatrooms.module';
import { MulterModule } from '@nestjs/platform-express';
import { AttachmentsModule } from './attachments/attachments.module';
import { Attachment } from './attachments/attachments.model';
import { UserRooms } from './chatrooms/user-rooms';
import { Room } from './chatrooms/chatrooms.model';
import { join } from 'path';
import { Chat } from './chats/chats.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PSWD,
      database: process.env.DB_NAME,
      models: [User, Role, UserRoles, UserRooms, Room, Branch, Chat, Attachment],
      autoLoadModels: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    MulterModule.register({
      dest: './files',
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    BranchesModule,
    SocketModule,
    ChatsModule,
    ChatroomsModule,
    AttachmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
