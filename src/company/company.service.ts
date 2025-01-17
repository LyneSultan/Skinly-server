import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto'; // For secure random password generation
import { Model } from 'mongoose';
import { Company } from 'schema/company.schema';
import { User } from 'schema/user.schema';
import { ScraperService } from 'src/scraper/scraper.service';
import { sendEmailWithPassword } from 'src/utils/email.util';
import { addCompany } from './DTO/addCompany.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly scraperService: ScraperService
  ) {}

  async addCompany(dto: addCompany, file: Express.Multer.File) {
    try {
      const randomPassword = crypto.randomBytes(6).toString('hex');

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
        user: newUser._id,
      });
      const scrapedProductsString = await this.scraperService.scrape(file);
      const scrapedProducts = JSON.parse(scrapedProductsString);
      newCompany.products = scrapedProducts;

      await newCompany.save();

      const subject = 'Your New Company Account Details';
      const emailContent = `<h3>Hello ${dto.name},</h3><p>Your account has been created. Your login password is: <strong>${newUser.password}</strong></p>`;

      // await sendEmailWithPassword(dto.name,dto.email,subject,emailContent);
      await sendEmailWithPassword(
        dto.name,
        'lynesultane@gmail.com',
        subject,
        emailContent
      );

      return newUser;
    } catch (error) {
      throw new HttpException('Failed to save ', HttpStatus.INTERNAL_SERVER_ERROR );
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
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
    }
  }

  async getCompanies(): Promise<Company[]> {
    try {
      // const companies = await this.companyModel.find();
      const companies = await this.companyModel.aggregate([
        {
          $project: {
            name: 1,
            productCount: { $size: '$products' },
          },
        },
      ]);
      return companies;
    } catch (error) {
      throw new HttpException('Could not get companies', HttpStatus.INTERNAL_SERVER_ERROR );
    }
  }

  async updateCompany(companyId: number, updateData: Partial<Company>) {
    try {
      const updatedCompany = await this.companyModel.findOneAndUpdate(
        { user: companyId },
        updateData,
        {
          new: true,
        }
      );

      if (!updatedCompany) {
        throw new HttpException( 'User not found or update failed',HttpStatus.NOT_FOUND);
      }

      return updatedCompany;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update the user',HttpStatus.BAD_REQUEST);
    }
  }

}
