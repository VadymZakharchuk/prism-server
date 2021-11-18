import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { Branch } from './branches.model';
import { UserBranches } from './user-branches';

@Module({
  providers: [BranchesService],
  controllers: [BranchesController],
  imports: [
    SequelizeModule.forFeature([Branch, User, UserBranches])
  ]
})
export class BranchesModule {}
