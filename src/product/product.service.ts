import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, Product } from 'schema/company.schema';
import { AddProductDto } from './DTO/addProduct.dto';

@Injectable()
export class ProductService {

  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) { }

  async addProductToCompany(companyId: string, addProductDto: AddProductDto): Promise<Company> {
    try {
      const company = await this.companyModel.findById(companyId);

      if (!company) {
        throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
      }

      const updatedCompany = await this.companyModel.findByIdAndUpdate(
        companyId,
        { $push: { products: addProductDto } },
        { new: true }
      );

      return updatedCompany;
    } catch (error) {
      throw new HttpException("Error in adding product"+error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsFromCompany(comapnyId: string,page: number = 3, pageSize: number = 5){
    try {
      const skip = (page - 1) * pageSize;
      const products = await this.companyModel.findById(comapnyId, { products: { $slice: [skip, pageSize] }, });
      if (!products) {
        throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
      }
      return products;
    } catch (error) {
      throw new HttpException("Error getting products "+error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllProducts(page: number = 3, pageSize: number = 5) {
    try {
      const companyCount = await this.companyModel.countDocuments({});
      const productsPerCompany = Math.floor(pageSize / companyCount);

      const skip = (page - 1) * pageSize;
      const products = await this.companyModel.find({}, { products: { $slice: [skip, productsPerCompany] }, });
      return products;
    } catch (error) {
      throw new HttpException('Error getting products with pagination'+error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCommonProduct(productName: string) {
    try {
      const companies = await this.companyModel.find({'products.name': productName});

      if (!companies || companies.length === 0) {
        throw new HttpException('No companies found with this product', HttpStatus.NOT_FOUND);
      }

      const commonProduct: { product: Product, companyName: string }[] = [];

      companies.forEach(company => {
        const matchingProducts = company.products.filter(product => product.name === productName);

        matchingProducts.forEach(product => {
          commonProduct.push({ companyName: company.name, product });
        });
      });

      return commonProduct;

    } catch (error) {
      throw new HttpException('Error finding common products'+error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
