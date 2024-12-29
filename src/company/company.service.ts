import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'schema/company.schema';
import { User } from 'schema/user.schema';
import { addCompany } from './DTO/addCompany.dto';

@Injectable()
export class CompanyService {
  constructor(
  @InjectModel(Company.name) private companyModel: Model<Company>,
  @InjectModel(User.name) private userModel: Model<User>) { }

  async addCompany(dto: addCompany){
    try {
      const newUser = new this.userModel({
        name: dto.name,
        email: dto.email,
        password: "dto.password",
        user_type: 'company',
      });
      await newUser.save();

      const newCompany = new this.companyModel({
        name: dto.name,
        scraping_file: dto.scraping_file,
        company_logo: dto.company_logo,
        user:newUser._id
      });
      await newCompany.save();

      return newCompany;

    } catch (error) {
      throw new HttpException("Error in adding the company, ensure all required fields", HttpStatus.BAD_REQUEST);
    }
  }

  async removeCompany(companyId: String): Promise<any> {
    try {
      const companyToDelete = await this.companyModel.findById(companyId);
      if (!companyToDelete) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }
      await this.companyModel.findByIdAndDelete(companyId);
      await this.userModel.findByIdAndDelete(companyToDelete.user);

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

  async updateCompany(companyId: number, updateData: Partial<Company>) {
    try {
      console.log(companyId, "comp");
      const updatedCompany = await this.companyModel.findOneAndUpdate(
        {user:companyId},
        updateData,
        {
          new: true,
        }
      );

      if (!updatedCompany) {
        throw new HttpException('User not found or update failed', HttpStatus.NOT_FOUND);
      }

      return  updatedCompany;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update the user', HttpStatus.BAD_REQUEST);
    }
  }

}
