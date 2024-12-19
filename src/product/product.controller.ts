import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddProductDto } from './DTO/addProduct.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get('/:id')
  async getProductsCompany(@Param('id') companyId:string){
    return this.productService.getProductsFromCompany(companyId);
  }

  @Get('common/:productName')
  async getCommonProducts(@Param('productName') productName: string) {
    return this.productService.getCommonProduct(productName);
  }

  @Post('/:id')
  async addProduct(@Param('id') companyId: string,
    @Body() addProductDto: AddProductDto) {
    return this.productService.addProductToCompany(companyId, addProductDto);
  }
}
