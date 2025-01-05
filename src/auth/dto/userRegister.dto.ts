import { IsNotEmpty, IsString } from 'class-validator';
import { LoginDto } from './userLogin.dto';

export class CreateUserDto  extends LoginDto{
  @IsNotEmpty({ message: 'Please Enter Fully Name' })
  @IsString({ message: 'Please Enter Valid Name' })
  name: string;

  @IsNotEmpty({ message: 'Please Confirm your password' })
  password_confirmation: string;
}

