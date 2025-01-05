import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, Product } from 'schema/company.schema';
import { compareTwoStrings } from 'string-similarity';
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
      const products = await this.companyModel.findOne({user:comapnyId}, { products: { $slice: [skip, pageSize] }, });
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
      const companies = await this.companyModel.find();

      if (!companies) {
        throw new HttpException('No companies found', HttpStatus.NOT_FOUND);
      }
      type productInfo={ product: Product; companyName: string; company_logo: string; similarity: number }
      const bestMatches: productInfo [] = [];
      const similarProducts: productInfo[] = [];
      const lowerCaseProductName = productName.toLowerCase();

      companies.forEach(company => {
        let bestMatchForCompany: productInfo | null = null;

        company.products.forEach(product => {
          const similarity = compareTwoStrings(product.name.toLowerCase(), lowerCaseProductName);
          if (similarity > 0.5) {
            if (!bestMatchForCompany || similarity > bestMatchForCompany.similarity) {
              bestMatchForCompany = {
                companyName: company.name,
                company_logo: company.company_logo,
                product,
                similarity
              };
            } else {
              similarProducts.push({
                companyName: company.name,
                company_logo: company.company_logo,
                product,
                similarity
              });
            }
          }
        });
        if (bestMatchForCompany) {
          bestMatches.push(bestMatchForCompany);
        }
      });

      if (bestMatches.length === 0) {
        throw new HttpException('No products found matching the name', HttpStatus.NOT_FOUND);
      }

      return { bestMatches, similarProducts:similarProducts };
    } catch (error) {
      throw new HttpException('Error finding common products: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
