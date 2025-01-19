import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { TokenInterceptor } from 'src/auth/services/token.service';
import { AddProductDto } from './DTO/addProduct.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async getAllProducts( @Query('page') page: number = 3, @Query('pageSize') pageSize: number = 5) {

    return this.productService.getAllProducts(page, pageSize);
  }

  @Get('company')
  @UseInterceptors(TokenInterceptor)
  async getProductsCompany( @Request() req, @Query('page') page: number = 3, @Query('pageSize') pageSize: number = 5) {

    return this.productService.getProductsFromCompany( req.user.sub,page,pageSize );
  }

  @Post('search')
  @UseInterceptors(TokenInterceptor)
  async searchProductCompany(@Request() req, @Body('name') name: string) {
    return this.productService.searchProductInCompany(req.user.sub, name);
  }

  @Get('common/:productName')
  async getCommonProducts(@Param('productName') productName: string) {
    return this.productService.getCommonProduct(productName);
  }

  @Post('/:id')
  async addProduct(  @Param('id') companyId: string,@Body() addProductDto: AddProductDto) {
    return this.productService.addProductToCompany(companyId, addProductDto);
  }

  @Get('/skin/:skinType')
  async getRecommendation(@Param('skinType') skinType: string) {
    return this.productService.suggestBestProducts(skinType);
  }
  @Get('/skin')
  async getRecommendationq() {
    return this.productService.suggestProducts();
  }
  @Get('/sample')
  async getRandom() {
    return this.productService.getAllRandomProducts();
  }
}
