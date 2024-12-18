import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto{

  @IsNotEmpty({ message: 'Please Enter Fully Name' })
  @IsString({ message: 'Please Enter Valid Name' })
  name: string;

  @IsNotEmpty({ message: 'Please Enter your password' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
