import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, Product } from 'schema/company.schema';
import { AddProductDto } from './DTO/addProduct.dto';

@Injectable()
export class ProductService {

  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) { }

  async addProductToCompany(companyId: String, addProductDto: AddProductDto): Promise<Company> {
    try {
      const company = await this.companyModel.findById(companyId);

      if (!company) {
        throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
      }

      const updatedCompany = await this.companyModel.findByIdAndUpdate(
        companyId,
        { $push: { products: addProductDto } },
        { new: true }
      );

      return updatedCompany;
    } catch (error) {
      throw new HttpException("Error in adding product", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsFromCompany(comapnyId: String):Promise <Product[]>{
    try {
      const company = await this.companyModel.findById(comapnyId);

      if (!company) {
        throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
      }

      return company.products;
    } catch (error) {
      throw new HttpException("Error getting products", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
