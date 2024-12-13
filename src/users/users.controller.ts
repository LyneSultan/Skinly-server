import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '../../schema/user.schema';
import { CreateUserDto, LoginDto } from './DTO/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Get('ban/:id')
  async banUser(@Param('id') userId: String) {
    return this.userService.ban(userId);
  }
}
