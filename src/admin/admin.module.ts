import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from '../../schema/company.schema';
import { User, UserSchema } from '../../schema/user.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Company.name, schema: CompanySchema },
    { name: User.name, schema: UserSchema },])],

  providers: [AdminService],
  controllers:[AdminController]
})
export class AdminModule {
}
