import {
  Body,
  Headers,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  UseInterceptors,
  UploadedFile, Res
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';
import { Roles } from '../decorators/roles-auth.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ValidationPipe } from '../pipes/validation.pipe';
import { IsUserAuth } from '../guards/is-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { getRandomFileName, HandleStaticPath } from '../decorators/StaticFilesHandling';
import { extname } from 'path';
import { Room } from '../chatrooms/chatrooms.model';

@ApiTags('table Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Получить данные авторизованного пользователя' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(RolesGuard)
  @Get('/me')
  getUserData(@Headers() headers) {
    return this.usersService.getUserData(headers);
  }

  @ApiOperation({ summary: 'Получить данные пользователя по ID' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(IsUserAuth)
  @Get('/:uid')
  getUserById(@Param('uid') uid: string) {
    return this.usersService.getUserById(uid);
  }

  @ApiOperation({ summary: 'Update данных пользователя по ID' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(IsUserAuth)
  @Post('/:uid')
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: (req, file, callback) => {
          let path = `./public/users/${req.params.userId}/avatars`;
          HandleStaticPath(path, { recursive: true }, err => { if (err) throw err })
          callback(null, path);
        },
        filename: (req, file, cb) => {
          return cb(null, `${getRandomFileName()}${extname(file.originalname)}`)
        }
      })
    }
    ))
  updateUserById(
    @Param('uid') uid: string,
    @UploadedFile() file,
    @Body() body,
  ) {
    return this.usersService.updateUserByID(
      uid,
      file,
      body,
      `http://${process.env.DB_HOST}:${process.env.APP_PORT}/users/${file.path}`)
  }

  @ApiOperation({ summary: 'Установить аватар пользователя по userID' })
  @ApiResponse({ status: 200, type: Room })
  @UseGuards(IsUserAuth)
  @Post('/:userId/avatar')
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: (req, file, callback) => {
          let path = `./public/users/${req.params.userId}/avatars`;
          HandleStaticPath(path, { recursive: true }, err => { if (err) throw err })
          callback(null, path);
        },
        filename: (req, file, cb) => {
          return cb(null, `${getRandomFileName()}${extname(file.originalname)}`)
        }
      })
    }
  ))
  uploadAvatar(@Param('userId') userId, @UploadedFile() file) {
    return this.usersService.setAvatar(
      userId,
      `http://${process.env.DB_HOST}:${process.env.APP_PORT}/users/${file.path}`);
  }

  @ApiOperation({ summary: 'Получить аватар пользователя по ID' })
  @ApiResponse({ status: 200, type: User })
  @Get('public/users/:uid/avatars/:fileId')
  async serveAvatar(
    @Param('uid') uid,
    @Param('fileId') fileId,
    @Res() res): Promise<any> {
    res.sendFile(fileId, { root: `public/users/${uid}/avatars`});
  }

  @ApiOperation({ summary: 'Добавить роль пользователю' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/add-role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Бан пользователю' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/set-ban')
  setBan(@Body() dto: BanUserDto) {
    return this.usersService.setBan(dto);
  }

  @ApiOperation({ summary: 'Удаление бана пользователю' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/remove-ban')
  removeBan(@Body() dto: BanUserDto) {
    return this.usersService.removeBan(dto);
  }
}
