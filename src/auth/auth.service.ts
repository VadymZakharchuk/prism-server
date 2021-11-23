import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcryptjs'
import { User } from "../users/users.model";
import { JwtService } from "@nestjs/jwt";
import { ForgotPasswordDto } from './dto/forgot-passowrd.dto';
import { SetNewPasswordDto } from './dto/set-new-passowrd.dto';

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

  async refreshToken(headers) {
    const authHeader = headers.authorization
    const bearer = authHeader.split(' ')[0]
    const rToken = authHeader.split(' ')[1]

    const tObj = this.jwtService.verify(
      rToken,
      {
        secret: process.env.SECRET_KEY,
        ignoreExpiration: true
      })

    const userDb = await this.userService.getUserByEmail(tObj.email)
    const userObj = this.jwtService.verify(
      userDb.rt,
      {
        secret: process.env.SECRET_KEY,
        ignoreExpiration: true
      })
    if (userDb.email === userObj.email) {
      const setTokens = await this.generateToken(userDb)
      userDb.rt = setTokens.refreshToken
      await userDb.save()
      return setTokens
    } else {
      throw new HttpException('Refresh Token Authentication Timeout', 419)
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userService.getUserByEmail(dto.email)
    if(!user) {
      throw new HttpException('Email not found', HttpStatus.NO_CONTENT)
    }
    const verifyCode = Math.ceil(Math.random() * 1000000)
    user.password = verifyCode.toString()
    // send Email to dto.email
    await user.save()
    return user.email
  }

  async setNewPassword(dto: SetNewPasswordDto) {
    console.log(dto.password, typeof dto.password)
    const hashPassword = await bcrypt.hash(dto.password, 5)
    return await this.userService.setNewPassword({ ...dto, password: hashPassword })
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
      accessToken: this.jwtService.sign(
        payloadJWT,
        {
          secret: process.env.SECRET_KEY,
          expiresIn: parseInt(process.env.JWT_EXP)
        }),
      refreshToken: this.jwtService.sign(
        payloadRT,
        { secret:
          process.env.SECRET_KEY
        })
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
