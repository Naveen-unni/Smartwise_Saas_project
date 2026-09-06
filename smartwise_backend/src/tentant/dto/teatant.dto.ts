import {IsString,IsNotEmpty,MinLength} from 'class-validator'

export class TeatantName{
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    name!:string;

}