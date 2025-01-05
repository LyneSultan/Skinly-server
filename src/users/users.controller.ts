import { Body, Controller, Get, Param, Patch, Request, UseInterceptors } from '@nestjs/common';
import { TokenInterceptor } from 'src/auth/services/token.service';
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
  @UseInterceptors(TokenInterceptor)
  async updateUser(@Request() request , @Body() updateData: Partial<any>) {
      return this.userService.updateUser(request.user.sub, updateData);
  }
}
