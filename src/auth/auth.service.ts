import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcryptjs'
import { User } from "../users/users.model";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

  constructor(private userService: UsersService,
              private jwtService: JwtService) {}

  async login(dtoUser: CreateUserDto) {
    const userObj = await this.validateUser(dtoUser)
    const setTokens = await this.generateToken(userObj)
    userObj.rt = setTokens.refreshToken
    await userObj.save()
    return setTokens
  }

  async register (dtoUser: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(dtoUser.email)
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким EMail уже существует.',
        HttpStatus.BAD_REQUEST
      )
    }
    const hashPassword = await bcrypt.hash(dtoUser.password, 5)
    const userObj = await this.userService.createUser({ ...dtoUser, password: hashPassword })
    return this.generateToken(userObj)
  }

  async refreshToken(rToken) {
    const tObj = this.jwtService.verify(rToken.token)
    const userObj = await this.userService.getUserById(tObj.id)
    console.log('rt / user.rt', rToken.token, userObj.rt);
    if (rToken === userObj.rt) {
      const setTokens = await this.generateToken(userObj)
      userObj.rt = setTokens.refreshToken
      await userObj.save()
      return setTokens
    } else {
      throw new HttpException('Refresh Token Authentication Timeout', 419)
    }
  }

  private async generateToken(user: User) {
    const payloadJWT = {
      email: user.email,
      id: user.id,
      roles: user.roles
    }
    const payloadRT = {
      email: user.email,
      id: user.id,
      issued: new Date()
    }
    return {
      accessToken: this.jwtService.sign(payloadJWT, {expiresIn: parseInt(process.env.JWT_EXP)}),
      refreshToken: this.jwtService.sign(payloadRT)
    }
  }

  private async validateUser(dtoUser: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dtoUser.email)
    const isPasswordValid = await bcrypt.compare(dtoUser.password, user.password)
    if (user && isPasswordValid) {
      return user
    }
    throw new UnauthorizedException('Некорректный EMail или пароль!')
  }

}
