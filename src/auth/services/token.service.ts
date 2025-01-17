import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (token) {
      try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        request.user = decoded;

      } catch (error) {
        throw new HttpException('Token expired or invalid', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('No token provided', HttpStatus.BAD_REQUEST);
    }
    return next.handle();
  }
}
