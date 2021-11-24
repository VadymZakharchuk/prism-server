import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Injectable()
export class RolesService {

  constructor(@InjectModel(Role) private repoRole: typeof Role){}

  async createRole(dto: CreateRoleDto){
    return await this.repoRole.create(dto)
  }

  async getRoleByValue(value: string){
    return await this.repoRole.findOne({ where: { value } })
  }
}
