import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException , InternalServerErrorException} from '@nestjs/common';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepsoitory:
    Repository<User>,
  ){}

  create(createUserDto: CreateUserDto) {
   const user=this.userRepsoitory.create(createUserDto);
   this.userRepsoitory.save(createUserDto);
    
  }

 

 async findOne(id: number) {
  try{ 
    const user= await this.userRepsoitory.findOne({where:{id:id,},});
    if (!user){
      throw new NotFoundException("user not found");
    }
    return {
      id:user.id,
      username:user.username,
      
    };
  }
    catch(error ){
      if (error instanceof NotFoundException){
        throw error;
      }
throw new InternalServerErrorException('Something went wrong');
    }
  }

 async update(id: number, updateUserDto: UpdateUserDto) {
    
  try{ 
    const user= await this.userRepsoitory.findOne({where:{id:id,},});
    if (!user){
      throw new NotFoundException("user not found");
    }

    Object.assign(user,updateUserDto)
    const updateuser=await this.userRepsoitory.save(user)
    return {
      id:updateuser.id,
      username:updateuser.username,
      
    };
  }
    catch(error ){
      if (error instanceof NotFoundException){
        throw error;
      }
throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: number) {
   
   try{ 
    const user= await this.userRepsoitory.findOne({where:{id:id,},});
    if (!user){
      throw new NotFoundException("user not found");
    }
   await this.userRepsoitory.remove(user);
   
    return {
       message: 'User deleted successfully',
    };
  }
    catch(error ){
      if (error instanceof NotFoundException){
        throw error;
      }
throw new InternalServerErrorException('Something went wrong');
    }
  }

}
