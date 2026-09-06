import {   Logger,Injectable,ConflictException,InternalServerErrorException } from '@nestjs/common';
import {Membership, MembershipRole} from './entites/membership.entity'
import {Tenant} from './entites/tentant.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TentantService {
private readonly logger = new Logger(TentantService.name);

constructor(
@InjectRepository(Tenant)
private readonly tentantRepository:Repository<Tenant>,
@InjectRepository(Membership)
private readonly memberRepository:Repository<Membership>

)
{}

async createtetant(name:string,user:string):Promise<Tenant>{
try{ 
    const tentant=await this.tentantRepository.findOne( {where:{name:name}},)
    if (tentant) throw new ConflictException ('Tentant already present');
    const tenant = this.tentantRepository.create({
  name: name,
});
const savedTenant = await this.tentantRepository.save(tenant);

    const data = this.memberRepository.create({
  userId: user,
  tenantId: savedTenant.id,
  role: MembershipRole.OWNER,
});

    
const savedmember=await this.memberRepository.save(data);


return savedTenant;




}catch(error){ 
this.logger.error( error instanceof Error ? error.stack : String(error))
 if (
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'teanted creation failed',
      );
}



}
}


