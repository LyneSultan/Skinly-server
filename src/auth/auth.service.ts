import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'schema/user.schema';
import { LoginDto } from 'src/users/DTO/userLogin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>) { }

  async login(loginDto: LoginDto) {

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

  }
}
