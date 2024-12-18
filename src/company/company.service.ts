import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'schema/company.schema';
import { AddCompanyDto } from './DTO/addCompany.dto';

@Injectable()
export class CompanyService {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {}


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

}
