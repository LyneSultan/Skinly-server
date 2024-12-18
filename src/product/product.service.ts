import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'schema/company.schema';
import { AddProductDto } from './DTO/addProduct.dto';

@Injectable()
export class ProductService {

  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) { }

  async addProductToCompany(companyId: String, addProductDto: AddProductDto): Promise<any> {
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      return { message: 'Company not found' };
    }

    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      companyId,
      { $push: { products: addProductDto } },
      { new: true }
    );

    return {
      message: 'Product added to company successfully',
      company: updatedCompany,
    };
  }
  async getProductsFromCompany(comapnyId: String):Promise <any>{

    const company = await this.companyModel.findById(comapnyId);

    if (!company) {
      return { message: "Company not found" }
    }

    return {
      message: "Company found",
      products:company.products,
    }
  }
}
