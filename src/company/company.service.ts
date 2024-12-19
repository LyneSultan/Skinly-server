import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'schema/company.schema';
import { AddCompanyDto } from './DTO/addCompany.dto';

@Injectable()
export class CompanyService {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) { }

  async addCompany(addCompanyDto: AddCompanyDto): Promise<Company> {
    try {
      const newCompany = new this.companyModel(addCompanyDto);
      await newCompany.save();
      return newCompany;

    } catch (error) {
      throw new HttpException("Error in adding the company, ensure of all required fields",HttpStatus.BAD_REQUEST)
    }
  }

  async removeCompany(companyId: String): Promise<any> {
    try {
      const companyToDelete = await this.companyModel.findByIdAndDelete(companyId);
      return {
        message: 'Company deleted successfully',
      };

    } catch (error) {
      throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
    }
  }

  async getCompanies(): Promise<Company[]>{
    try {
      const companies = await this.companyModel.find();
      return companies;
    } catch (error) {
      throw new HttpException("Could not get companies", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
