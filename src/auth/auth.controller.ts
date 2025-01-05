import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { LoginDto } from './dto/userLogin.dto';
import { CreateUserDto } from './dto/userRegister.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto){
    return this.authService.createUser(createUserDto);
  }

  @Post('reset')
  async reset(@Body() resetPassword:ResetPasswordDto){
    return this.authService.resetpassword(resetPassword.email,resetPassword.password);
  }
  @Post('sendCode')
  async sendVerificationCode(@Body() body: { email: string }) {
    return this.authService.sendVerificationCode(body.email);
  }
}
