import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,@InjectModel(User.name) private userModel: Model<User>
  ) { }

}
