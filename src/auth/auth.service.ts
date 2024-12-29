import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'schema/user.schema';
import { LoginDto } from 'src/users/DTO/userLogin.dto';
import { CreateUserDto } from 'src/users/DTO/userRegister.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>) { }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email: loginDto.email, });
      if (!user) {
        throw new HttpException( { message: ['Invalid credentials'] }, HttpStatus.BAD_REQUEST);
      }
      if (user.password !== loginDto.password) {
        throw new HttpException( { message: ['Invalid credentials'] }, HttpStatus.BAD_REQUEST);

      }
      const payload = { username: user.name, sub: user.id, role: user.user_type };
      return {
        user,
        access_token: this.jwtService.sign(payload),
      };
    }catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({ message: ['An unexpected error occurred'] }, HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existingEmail = await this.userModel.findOne({ 'email': createUserDto.email });

      if (existingEmail) {
        throw new HttpException({ message: ['Choose another email'] }, HttpStatus.BAD_REQUEST);
      }

      if (createUserDto.password !== createUserDto.password_confirmation) {
        throw new HttpException({ message: ['Passwords do not match'] }, HttpStatus.BAD_REQUEST);
      }
      const newUser = new this.userModel(createUserDto);
      await newUser.save();
      const payload = { username: newUser.name, sub: newUser.id, role: newUser.user_type };
      return {
        newUser,
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({ message: ['An unexpected error occurred']},HttpStatus.INTERNAL_SERVER_ERROR,);}
  }
}
