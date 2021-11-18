import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";

@Injectable()
export class UsersService {

  constructor(@InjectModel(User)
              private repoUser: typeof User,
              private rolesService: RolesService){}

  async createUser (dto: CreateUserDto) {
    const user = await this.repoUser.create(dto)
    const role = await this.rolesService.getRoleByValue('ADMIN')
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
  async getUserData (req) {
    console.log(req.headers);
  }
}
