import { Body, Headers, Controller, Post} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "../users/users.model";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from './dto/forgot-passowrd.dto';
import { SetNewPasswordDto } from './dto/set-new-passowrd.dto';

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
  refreshToken(@Headers() headers) {
    return this.authService.refreshToken(headers)
  }

  @ApiOperation({summary: 'Забыл пароль'})
  @ApiResponse({status: 200, type: User})
  @Post('/forgot')
  forgotPassword(@Body() obj: ForgotPasswordDto) {
    return this.authService.forgotPassword(obj)
  }

  @ApiOperation({summary: 'Установить новый пароль'})
  @ApiResponse({status: 200, type: User})
  @Post('/set-new')
  setNewPassword(@Body() obj: SetNewPasswordDto) {
    return this.authService.setNewPassword(obj)
  }
}
