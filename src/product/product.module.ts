import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'schema/company.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema }])],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
