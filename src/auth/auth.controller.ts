import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "../users/users.model";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { UsersService } from '../users/users.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService){}

  @ApiOperation({summary: 'Авторизация пользователя'})
  @ApiResponse({status: 200, type: User})
  @Post('/login')
  login(@Body() dtoUser: CreateUserDto) {
    return this.authService.login(dtoUser)
  }

  @ApiOperation({summary: 'Регистрация пользователя'})
  @ApiResponse({status: 200, type: User})
  @Post('/registration')
  registration(@Body() dtoUser: CreateUserDto) {
    return this.authService.register(dtoUser)
  }

  @ApiOperation({summary: 'Обновление пары токенов'})
  @ApiResponse({status: 200, type: User})
  @Post('/refresh')
  refreshToken(@Body() token) {
    return this.authService.refreshToken(token)
  }
}
