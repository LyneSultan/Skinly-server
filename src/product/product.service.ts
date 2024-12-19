import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginateData } from 'pagination/pagination';
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

  async getProductsFromCompany(comapnyId: string,page: number = 2, pageSize: number = 5):Promise<Product[]>{
    try {
      const company = await this.companyModel.findById(comapnyId);

      if (!company) {
        throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
      }
      const paginatedProducts = paginateData(company.products, page, pageSize);

      return paginatedProducts;
    } catch (error) {
      throw new HttpException("Error getting products "+error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllProducts(page: number = 1, pageSize: number = 5) : Promise<Product[]>{
    try {
      const companies = await this.companyModel.find().select('products');

      const productsPerCompany = Math.floor(pageSize / companies.length);

      const paginatedCompanies = [];

      for (const company of companies) {
        const paginatedProducts = paginateData(company.products, page, productsPerCompany);
        paginatedCompanies.push( paginatedProducts);
      }
      return paginatedCompanies;

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
