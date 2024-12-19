import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LoginDto } from './DTO/userLogin.dto';
import { CreateUserDto } from './DTO/userRegister.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  async getUsers(){
    return this.userService.getUsers();
  }
  @Get('ban/:id')
  async banUser(@Param('id') userId: string) {
    return this.userService.ban(userId);
  }
  @Get('unban/:id')
  async unbanUser(@Param('id') userId: string) {
    return this.userService.unban(userId);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto){
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

}
