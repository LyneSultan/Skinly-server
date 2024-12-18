import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '../../schema/user.schema';
import { CreateUserDto } from './DTO/createUser.dto';
import { LoginDto } from './DTO/userLogin.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  async getUsers(): Promise<any>{
    return this.userService.getUsers();
  }
  @Get('ban/:id')
  async banUser(@Param('id') userId: String) {
    return this.userService.ban(userId);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

}
