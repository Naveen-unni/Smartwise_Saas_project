import {Body,Controller,Post,Req,Res} from '@nestjs/common'
import {LoginDto} from './dto/login.dto'
import {RegisterDto} from './dto/reg.dto'
import type {Request,Response} from "express";
import {AuthService} from './auth.service'


@Controller('auth')
export class  AuthController{
    constructor ( private readonly authService: AuthService,){}

 @Post('register')
 async Regsister(@Body() reg:RegisterDto){
   const user=await this.authService.register(
    reg
   );

   return{
    "status_code":201,
    "Message":"User created",
    "userid":user.userid
   }

 }

 @Post('login')
async Login(@Body() login:LoginDto,@Res ({passthrough:true}) res:Response,){
  
   const token = await this.authService.login(login);

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

   return{
    "status_code":200,
    "Message":"User login",
   
   }
 }

}