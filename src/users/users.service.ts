import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schema/user.schema';
import { LoginDto } from './DTO/userLogin.dto';
import { CreateUserDto } from './DTO/userRegister.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingEmail = await this.userModel.findOne({
        'email': createUserDto.email,
      });
      if (existingEmail) {
        throw new HttpException('Email must be unique.', HttpStatus.BAD_REQUEST);
      }
        const newUser = new this.userModel(createUserDto);
        await newUser.save();
        return newUser;
      } catch (error) {
        throw new HttpException('Error on register: ' + error.message, HttpStatus.BAD_REQUEST);
      }

  }

  async login(loginDto: LoginDto): Promise<User>  {
    try {
      const user = await this.userModel.findOne({ email: loginDto.email })
      if (!user)
        throw new HttpException("This email is not found", HttpStatus.NOT_FOUND);

      if (user.password !== loginDto.password)
        throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);

      return user;
    } catch (error) {
      throw new HttpException("Error in login"+ error.message,HttpStatus.BAD_REQUEST)
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (error) {
      throw new HttpException('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async ban(userId: string): Promise<User>{
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { ban: true },
        { new: true }
      );

      if (!updatedUser) {
        throw new HttpException('User not found or update failed', HttpStatus.NOT_FOUND);
      }

      return updatedUser;

    } catch (error) {
      throw new HttpException("failed to ban the user"+ error.message,HttpStatus.BAD_REQUEST)
    }
  }

  async unban(userId: string): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { ban: false },
        { new: true }
      );

      if (!updatedUser) {
        throw new HttpException('User not found or update failed', HttpStatus.NOT_FOUND);
      }

      return updatedUser;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to unban the user', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

      if (!updatedUser) {
        throw new HttpException('User not found or update failed', HttpStatus.NOT_FOUND);
      }

      return updatedUser;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update the user', HttpStatus.BAD_REQUEST);
    }
  }
}
