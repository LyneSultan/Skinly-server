import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'schema/user.schema';
import { LoginDto } from 'src/auth/dto/userLogin.dto';
import { CreateUserDto } from 'src/auth/dto/userRegister.dto';
import { sendEmailWithPassword } from 'src/utils/email.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email: loginDto.email });

      if (!user) {
        throw new HttpException({ message: ['Invalid credential'] }, HttpStatus.BAD_REQUEST);
      }

      // const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

      if (user.password !== loginDto.password) {
        throw new HttpException( { message: ['Invalid credentials'] },HttpStatus.BAD_REQUEST );
      }

      if (user.ban) {
        throw new HttpException({ message: ['banned'] }, HttpStatus.FORBIDDEN);
      }
      const payload = {
        username: user.name,
        sub: user.id,
        role: user.user_type,
      };

      return {
        user,
        access_token: this.jwtService.sign(payload),
      };

    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException({ message: ['An unexpected error occurred'] },HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existingEmail = await this.userModel.findOne({ email: createUserDto.email,});

      if (existingEmail) {
        throw new HttpException( { message: ['Choose another email'] }, HttpStatus.BAD_REQUEST );
      }

      if (createUserDto.password !== createUserDto.password_confirmation) {
        throw new HttpException({ message: ['Passwords do not match'] }, HttpStatus.BAD_REQUEST );
      }

      const newUser = new this.userModel(createUserDto);
      // const hashedPassword = await bcrypt.hash(newUser.password, 10);
      // newUser.password = hashedPassword;
      await newUser.save();

      const payload = {
        username: newUser.name,
        sub: newUser.id,
        role: newUser.user_type,
      };

      return {
        user: newUser,
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException({ message: ['An unexpected error occurred' + error] }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetpassword(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new HttpException('Email not found in the database', HttpStatus.NOT_FOUND );
    }

    user.password = password;
    await user.save();

    const payload = { username: user.name, sub: user.id, role: user.user_type };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendVerificationCode(email: string) {
    try {


      const user = await this.userModel.findOne({ email: email });

      if (!user) {
        throw new HttpException('Email not found in the database', HttpStatus.NOT_FOUND);
      }

      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

      const subject = 'Verification code';
      const emailContent = `<h3>Hello,</h3><p> Your Verifcation code is
       <strong>${verificationCode}</strong></p>`;

      await sendEmailWithPassword(user.name, user.email, subject, emailContent);

      return verificationCode;
    } catch (error) {
      throw new HttpException({ message: ['An unexpected error occurred' + error] }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
