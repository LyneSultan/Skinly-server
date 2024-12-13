import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../../schema/company.schema';
import { AddCompanyDto } from './DTO/admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {}

  async addCompany(addCompanyDto: AddCompanyDto): Promise<any> {
    const newCompany = new this.companyModel(addCompanyDto);
    await newCompany.save();
    return {
      message: 'Company created successfully',
      company: newCompany,
    };
  }
}
