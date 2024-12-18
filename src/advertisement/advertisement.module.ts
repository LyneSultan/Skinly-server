import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'schema/company.schema';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementService } from './advertisement.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Company.name, schema: CompanySchema }])],
  controllers: [AdvertisementController],
  providers: [AdvertisementService]
})
export class AdvertisementModule {}
