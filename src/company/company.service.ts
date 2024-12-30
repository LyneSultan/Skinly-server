import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as crypto from 'crypto'; // For secure random password generation
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
      const randomPassword = crypto.randomBytes(8).toString('hex');

      const newUser = new this.userModel({
        name: dto.name,
        email: dto.email,
        password: randomPassword,
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

      const mailjetResponse = await this.sendEmailWithPassword(dto.name,dto.email, randomPassword);

      if (mailjetResponse.status !== 200) {
        throw new HttpException('Failed to send email to the company', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return newCompany;

    } catch (error) {

      throw new HttpException('Failed to ', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }

  async sendEmailWithPassword(name:string,toEmail: string, password: string) {
    try {
      const emailBody = {
        "Messages": [
          {
            "From": {
              "Email": "lynesultane@gmail.com",
              "Name": "Skinly",
            },
            "To": [
              {
                "Email": toEmail,
                "Name": name,
              },
            ],
            "Subject": "Your New Company Account Details",
            "TextPart": `Hello,\n\nYour account has been created. Your login password is: ${password}`,
            "HTMLPart": `<h3>Hello,</h3><p>Your account has been created. Your login password is: <strong>${password}</strong></p>`
          }
        ]
      };

      const response = await axios.post('https://api.mailjet.com/v3.1/send', emailBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${process.env.API_KEY_EMAIl}:${process.env.KEY}`).toString('base64')}`,
        },
      });

      return response;
    } catch (error) {
      console.error("Error sending email with Mailjet:", error);
      throw new HttpException('Failed to send email with Mailjet', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeCompany(companyId: String) {
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
