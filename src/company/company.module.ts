import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'schema/company.schema';
import { User, UserSchema } from 'schema/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({

  imports: [MongooseModule.forFeature([
  { name: Company.name, schema: CompanySchema },{ name: User.name, schema: UserSchema }]),AuthModule],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
