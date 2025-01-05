import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async getUsers(): Promise<{ users: User[]; count: number }> {
    try {
      const users = await this.userModel.find({ user_type: 'user' });
      const count = users.length;

      return { users, count };
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
