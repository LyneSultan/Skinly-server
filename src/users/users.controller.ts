import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdminGuard } from 'src/auth/admin.guard';
import { TokenInterceptor } from 'src/auth/services/token.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  @UseGuards(AdminGuard)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('ban/:id')
  @UseGuards(AdminGuard)
  async banUser(@Param('id') userId: string) {
    return this.userService.ban(userId);
  }
  @Get('unban/:id')
  @UseGuards(AdminGuard)
  async unbanUser(@Param('id') userId: string) {
    return this.userService.unban(userId);
  }
  @Patch()
  @UseInterceptors(TokenInterceptor)
  async updateUser(@Request() request, @Body() updateData: Partial<any>) {
    return this.userService.updateUser(request.user.sub, updateData);
  }

  @Post('/profile')
  @UseInterceptors(
    TokenInterceptor,
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          callback(null, uniqueName);
        },
      }),
    })
  )
  async changeProfile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const profileData = {
      userId: req.user.sub,
      imagePath: file.path,
    }

    return await this.userService.changeProfile(profileData);
  }

}
