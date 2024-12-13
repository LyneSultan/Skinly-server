import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/skinly'),
    UsersModule,
    AdminModule,
    CompanyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
