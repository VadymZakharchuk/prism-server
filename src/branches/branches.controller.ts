import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { Role } from '../roles/roles.model';
import { CreateBranchDto } from './dto/create-branch.dto';

@ApiTags('table Branches')
@Controller('branches')
export class BranchesController {

	constructor(private branchesService: BranchesService) {}

	@ApiOperation({summary: 'Создание организации'})
	@ApiResponse({status: 200, type: Role})
	@Post()
	createBranch(@Body() dto: CreateBranchDto) {
		return this.branchesService.createBranch(dto)
	}

	@ApiOperation({summary: 'Получить settings организации'})
	@ApiResponse({status: 200, type: Role})
	@Get(':branchName')
	getByName(@Param('name') name: string){
		return this.branchesService.getByName(name)
	}
}
