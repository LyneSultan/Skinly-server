import { IsEmail, IsNotEmpty } from 'class-validator';
import { LoginDto } from './userLogin.dto';

export class CreateUserDto  extends LoginDto{

  @IsNotEmpty({ message: 'Please Enter your email' })
  @IsEmail({}, { message: 'Please Enter a Valid Email' })
  email: string;

  @IsNotEmpty({ message: 'Please Confirm your password' })
  password_confirmation: string;
}

