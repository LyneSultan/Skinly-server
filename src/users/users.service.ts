import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginDto } from './DTO/user.dto';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto:CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async login(loginDto: LoginDto): Promise<any>  {
    const user =await this.userModel.findOne({name:loginDto.name})
    if (!user) {
      return {message:"Invalid credentials"}
    }

    if (user.password !== loginDto.password)
      return {message:"Invalid credentials"}

    return { message: "login successful", user: user };

  }
}
