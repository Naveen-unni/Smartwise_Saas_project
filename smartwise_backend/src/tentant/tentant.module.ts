import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TentantController } from './tentant.controller';
import { TentantService } from './tentant.service';

import { Membership } from './entites/membership.entity';
import { Tenant } from './entites/tentant.entity';
import{Project} from './entites/project.entity'
import {ProjectMember} from './entites/projectmembership.entity'
@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, Membership,Project,ProjectMember]),
  ],
  controllers: [TentantController],
  providers: [TentantService],
})
export class TentantModule {}