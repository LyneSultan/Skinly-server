import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../../schema/company.schema';
import { User } from '../../schema/user.schema';
import { AddProductDto } from './DTO/addProduct.dto';
import { AddCompanyDto } from './DTO/admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>,
  @InjectModel(User.name) private userModel: Model<User>) { }

  async addCompany(addCompanyDto: AddCompanyDto): Promise<any> {
    const newCompany = new this.companyModel(addCompanyDto);
    await newCompany.save();
    return {
      message: 'Company created successfully',
      company: newCompany,
    };
  }
  async removeCompany(companyId: String): Promise<any> {
    const companyToDelete = await this.companyModel.findByIdAndDelete(companyId);

    return {
      message: 'Company deleted successfully',
    };
  }
  async getCompanies(): Promise<any>{
    const companies = await this.companyModel.find();
    return {
      message: 'get all companies',
      companies:companies
    }
  }
  async getUsers(): Promise<any>{
    const users = await this.userModel.find();
    if (!users)
      return {message:"no users"}
    return {
      message: "getting users",
      users:users
    }
  }
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

}
