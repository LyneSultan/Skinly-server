import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { promises as fs } from 'fs';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import * as path from 'path';
import { Company, Product } from 'schema/company.schema';
import { compareTwoStrings } from 'string-similarity';
import { AddProductDto } from './DTO/addProduct.dto';

@Injectable()
export class ProductService {
  private openai: OpenAI;

  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {
    this.openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
  }

  async addProductToCompany(companyId: string, addProductDto: AddProductDto): Promise<Company> {

    try {
      const company = await this.companyModel.findById(companyId);

      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      const updatedCompany = await this.companyModel.findByIdAndUpdate(
        companyId,
        { $push: { products: addProductDto } },
        { new: true }
      );

      return updatedCompany;
    } catch (error) {
      throw new HttpException('Error in adding product' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async searchProductInCompany(companyId: string, searchQuery: string) {
    try {
      const company = await this.companyModel.findOne(
        {
          user: companyId,
          'products.name': { $regex: searchQuery, $options: 'i' },
        },
        {
          'products.$': 1,
        }
      );

      if (!company || !company.products || company.products.length === 0) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }

      return company.products;
    } catch (error) {
      throw new HttpException('Error searching for product: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsFromCompany(comapnyId: string, page: number = 3, pageSize: number = 5) {
    try {
      const skip = (page - 1) * pageSize;
      const company = await this.companyModel.findOne(
        { user: comapnyId },
        {
          products: { $slice: [skip, pageSize] },
        }
      );
      const count = await this.companyModel.findOne(
        { user: comapnyId },
        { productsCount: { $size: '$products' } }
      );

      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }
      return {
        products: company.products,
        count,
      };
    } catch (error) {
      throw new HttpException('Error getting products ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllProducts(page: number = 3, pageSize: number = 5) {
    try {
      const companyCount = await this.companyModel.countDocuments({});
      let productsPerCompany = Math.floor(pageSize / companyCount);

      if (productsPerCompany % 2 !== 0) {
        productsPerCompany += 1;
      }

      const skip = (page - 1) * pageSize;
      const products = await this.companyModel.find(
        {},
        { products: { $slice: [skip, productsPerCompany] } }
      );
      return products;
    } catch (error) {
      throw new HttpException('Error getting products with pagination' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getCommonProduct(productName: string) {
    try {
      const companies = await this.companyModel.find();

      if (!companies) {
        throw new HttpException('No companies found', HttpStatus.NOT_FOUND);
      }
      type productInfo = {
        product: Product;
        companyName: string;
        company_logo: string;
        similarity: number;
      };
      const bestMatches: productInfo[] = [];
      const similarProducts: productInfo[] = [];

      const lowerCaseProductName = productName.toLowerCase();
      companies.forEach((company) => {
        let bestMatchForCompany: productInfo | null = null;
        console.log('Processing Company:', company.name, 'Logo:', company.company_logo); // Debugging log


        company.products.forEach((product) => {
          if (!product.name || !product.image || product.image === '') {
            return;
          }


          const similarity = compareTwoStrings(
            product.name.toLowerCase(),
            lowerCaseProductName
          );
          if (similarity > 0.5) {
            if (
              !bestMatchForCompany ||
              similarity > bestMatchForCompany.similarity
            ) {
              bestMatchForCompany = {
                companyName: company.name,
                company_logo: company.company_logo,
                product,
                similarity,
              };
            } else {
              similarProducts.push({
                companyName: company.name,
                company_logo: company.company_logo,
                product,
                similarity,
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

      return { bestMatches, similarProducts: similarProducts };
    } catch (error) {
      throw new HttpException('Error finding common products: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async suggestBestProducts(skinType: string) {
    try {
      const products = await this.getAllRandomProducts();

      const prompt = `Here is a list of products:${products}Based on the skin type ${skinType}, please suggest 3 best products from the list
       just in json format [{"name":productName},{...}] `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a skincare expert.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
      });

      const responseContent = completion.choices[0].message.content.trim();
      return { suggestions: responseContent };
    } catch (error) {
      throw new HttpException('Error suggesting products: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllRandomProducts(numberOfProducts: number = 10) {
    try {
      const result = await this.companyModel.aggregate([
        { $unwind: '$products' },
        { $sample: { size: numberOfProducts } },
        {
          $project: {
            product: '$products',
          },
        },
      ]);

      if (!result || result.length === 0) {
        throw new HttpException('No products available', HttpStatus.NOT_FOUND);
      }
      return result.map((item) => ({
        name: item.product.name,
        link: item.product.image,
      }));
          } catch (error) {
      throw new HttpException('Error getting random products: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async suggestProducts() {
    const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  try {
    const uploadsDir = path.resolve(__dirname, '../../../', 'uploads');
    const filePath = path.resolve(uploadsDir, 'skincare_suggestions.json');

    try {
      await fs.access(uploadsDir);
    } catch (error) {
      await fs.mkdir(uploadsDir);
    }

    let isFileValid = false;
    try {
      const stats = await fs.stat(filePath);
      const fileAge = Date.now() - new Date(stats.mtime).getTime();
      isFileValid = fileAge < ONE_DAY_IN_MILLISECONDS;
    } catch (error) {
      console.log('File does not exist or cannot be accessed. Regenerating...');
    }

    if (isFileValid) {
      console.log('Using existing skincare suggestions JSON.');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(fileContent);
    }

    console.log('Generating new skincare suggestions JSON.');

    const products = await this.getAllRandomProducts();

    const prompt = `
      Generate a JSON file just JSON format that categorizes skincare products based on skin types: "dry," "normal," and "oily." Each category should include:
      1. Three skincare tips specific to the skin type.
      2. An array of products with the following attributes:
         - "id" (unique identifier starting from 1).
         - "name" (name of the product from the provided list).
         - "image_url" (the product image).
         - "reason" (why this product is suitable for the skin type).

      Use this example structure for the JSON output:
      {
        "skin_types": {
          "dry": {
            "tips": [...],
            "products": [...],
          },
          "normal": {
            "tips": [...],
            "products": [...],
          },
          "oily": {
            "tips": [...],
            "products": [...],
          }
        }
      }

      Populate each category with at least two example products from the following list:
      ${JSON.stringify(products, null, 2)}
      Ensure names and URLs are directly from the list and reasons align with the skin type.
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a skincare expert.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 900
    });

    const responseContent = completion.choices[0].message.content.trim();
    console.log('OpenAI Response:', responseContent);

    await fs.writeFile(filePath, JSON.stringify(responseContent, null, 2), 'utf-8');

    return responseContent; // Return the newly generated JSON
  } catch (error) {
    throw new HttpException('Error suggesting products: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}




