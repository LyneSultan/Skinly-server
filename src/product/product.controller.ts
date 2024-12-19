import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddProductDto } from './DTO/addProduct.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get('/:id')
  async getProductsCompany(@Param('id') companyId:String){
    return this.productService.getProductsFromCompany(companyId);
  }

  @Post('/:id')
  async addProduct(@Param('id') companyId: String,
    @Body() addProductDto: AddProductDto) {
    return this.productService.addProductToCompany(companyId, addProductDto);
  }
}
