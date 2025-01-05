import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto{

  @IsNotEmpty({ message: 'Please Enter your email' })
  @IsEmail({}, { message: 'Please Enter a Valid Email' })
  email: string;

  @IsNotEmpty({ message: 'Please Enter your password' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
