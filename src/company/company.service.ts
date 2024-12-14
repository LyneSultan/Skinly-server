import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'schema/company.schema';
import { AddAdvertisementDto } from './DTO/AddAdvertisement.dto';

@Injectable()
export class CompanyService {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {}

  async addAdvertisementToProduct(
    companyId: string,
    productName: string,
    addAdvertisementDto: AddAdvertisementDto,
  ): Promise<any> {

    const company = await this.companyModel.findById(companyId);

    if (!company) {
      return { message: 'Company not found' };
    }


    const product = company.products.find((p) => p.name === productName);

    if (!product) {
      return { message: 'Product not found' };
    }


    if (!product.additional_info) {
      product.additional_info = { advertisement: '' };
    }


    product.additional_info.advertisement = addAdvertisementDto.advertisement;
    company.markModified('products');

    try {
      await company.save();
      return {
        message: 'Advertisement added successfully',
        product,
      };
    } catch (error) {
      return { message: 'Error saving advertisement', error };
    }
  }

}
