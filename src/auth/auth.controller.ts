import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "../users/users.model";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";

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
}
