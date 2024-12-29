import { Body, Controller, Get, Headers, HttpException, Param, Patch, Post } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import * as jwt from 'jsonwebtoken';
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

  @Patch()
  async updateUser(@Headers('Authorization') token: string, @Body() updateData: Partial<any>) {

    if (!token) {
      throw new HttpException('No token provided',HttpStatusCode.BadRequest);
    }

    try {
      const decoded = jwt.verify(token, "your_secret_key") as jwt.JwtPayload;
      const userId = decoded.sub;
      return this.userService.updateUser(userId, updateData);
    } catch (error) {
      throw new HttpException('No token expired',HttpStatusCode.BadRequest);
    }
    
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
