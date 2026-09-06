import { Controller,Post,UseGuards,Body } from '@nestjs/common';
import {TentantService} from './tentant.service'
import {JwtGuard} from '../auth/guards/jwt-auth.guard'
import {TeatantName} from './dto/teatant.dto'
import {CurrentUser} from '../common/decorator/userid'

@Controller('tentant')
export class TentantController {

 constructor ( private readonly tenantservice:TentantService){}

 @Post('create')
@UseGuards(JwtGuard)
 async createtetant (@Body() dto:TeatantName,@CurrentUser('userid') user:string){

const tetantuser=await this.tenantservice.createtetant(dto.name,user);


return {
    success: true,
    status_code: 201,
    message: 'Tenant created successfully',
    data: {
      tenant_id: tetantuser.id,
      name: tetantuser.name,
      created_at: tetantuser.createdAt,
    },
  };

 }





}
