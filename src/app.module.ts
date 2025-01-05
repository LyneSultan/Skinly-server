import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { AdvertisementModule } from './advertisement/advertisement.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { OcrModule } from './ocr/ocr.module';
import { ProductModule } from './product/product.module';
import { SkinTypeDetectionModule } from './skin-type-detection/skin-type-detection.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    MulterModule.register({dest: './uploads', }),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    UsersModule,
    AdminModule,
    CompanyModule,
    AdvertisementModule,
    AuthModule,
    ProductModule,
    SkinTypeDetectionModule,
    OcrModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
