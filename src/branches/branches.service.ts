import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Branch } from './branches.model';
import { CreateBranchDto } from './dto/create-branch.dto';


@Injectable()
export class BranchesService {

	constructor(@InjectModel(Branch) private repoBranch: typeof Branch){}

	async createBranch(dto: CreateBranchDto) {
		return await this.repoBranch.create(dto)
	}

	async getByName(name: string) {
		return await this.repoBranch.findAll({ where: { name } })
	}
}
