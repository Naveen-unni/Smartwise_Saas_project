import{
    IsEmail,
    IsString,
    MinLength
} from 'class-validator'

export class RegisterDto {

  @IsString()
  @MinLength(5)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}