import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, Product } from 'schema/company.schema';

@Injectable()
export class AdvertisementService {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) { }

  async addAdvertisementToProduct(
    companyId: string,
    productName: string,
    advertisement: string) {

    try {
      const company = await this.companyModel.findOne({user:companyId});

      if (!company) {
        throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
      }

      const product = company.products.find((p) => p.name === productName);

      if (!product) {
        throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
      }
      if (!product.additional_info) {
        product.additional_info = { advertisement: '' };
      }
      product.additional_info.advertisement = advertisement;
      company.markModified('products');

      await company.save();
      return product;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Error in adding ads", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAdvertisementForProduct(
    companyId: string,
    productName: string): Promise<Product> {
    try {
      const company = await this.companyModel.findById(companyId);

      if (!company) {
        throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
      }

      const product = company.products.find((p) => p.name === productName);

      if (!product) {
        throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
      }

      if (product.additional_info.advertisement) {
        return product;
      } else {
        throw new HttpException("No ads for this product", HttpStatus.NOT_FOUND);
      }

    }catch (error) {
      throw new HttpException("Error getting ads",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
