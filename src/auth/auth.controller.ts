import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/users/DTO/userLogin.dto';
import { CreateUserDto } from 'src/users/DTO/userRegister.dto';
import { AuthService } from './auth.service';

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

}
