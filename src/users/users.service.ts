import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { JwtService } from '@nestjs/jwt';
import { SetNewPasswordDto } from '../auth/dto/set-new-passowrd.dto';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User)
              private repoUser: typeof User,
              private jwtService: JwtService,
              private rolesService: RolesService){}

  async createUser (dto: CreateUserDto) {
    const user = await this.repoUser.create(dto)
    const role = await this.rolesService.getRoleByValue('USER')
    await user.$set('roles', [role.id])
    user.roles = [role]
    return user
  }

  async getAllUsers() {
    return await this.repoUser.findAll({include: { all: true }})
  }

  async getUserByEmail(email: string) {
    return await this.repoUser.findOne({where: {email}, include: {all: true}})
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.repoUser.findByPk(dto.userId)
    const role = await this.rolesService.getRoleByValue(dto.value)
    if (role && user) {
      await user.$add('role', role.id)
      return dto
    }
    throw new HttpException('Роль или пользователь не найдены', HttpStatus.NOT_FOUND)
  }
  async setBan(dto: BanUserDto) {
    const user = await this.repoUser.findByPk(dto.userId)
    if(!user){
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }
    user.banned = true
    user.banReason = dto.banReason
    await user.save()
    return user
  }
  async removeBan (dto: BanUserDto) {
    const user = await this.repoUser.findByPk(dto.userId)
    if(!user){
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }
    user.banned = false
    user.banReason = ''
    await user.save()
    return user
  }
  async getUserData (headers) {
    try {
      const authHeader = headers.authorization
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]
      if( bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Пользователь не авторизован')
      }
      const user = this.jwtService.verify(token,
        { secret: process.env.SECRET_KEY})
      return await this.repoUser.findByPk(user.id)
    } catch (e) {
      throw new HttpException(e.name, 401)
    }
  }
  async getUserById(id: string) {
    return await this.repoUser.findByPk(id)
  }
  async setNewPassword(dto: SetNewPasswordDto) {
    const user = await this.getUserByEmail(dto.email)
    if(!user){
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }
    if( user.password !== dto.verifyCode) {
      throw new HttpException('Wrong verify code', HttpStatus.CONFLICT)
    }
    user.password = dto.password
    await user.save()
    return user
  }
}
