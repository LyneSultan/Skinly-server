import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schema/user.schema';
import { CreateUserDto, LoginDto } from './DTO/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
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

  async getUsers(): Promise<any> {
    const users = await this.userModel.find();
    if (!users)
      return { message: "no users" }
    return {
      message: "getting users",
      users: users
    }
  }

  async ban(userId: String): Promise<any>{

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { ban: true },
      { new: true }
    );
    if (!updatedUser)
      return { mesage: "User not found" }

    return {
      message: "User is banned",
      user: updatedUser
    };

  }
}
