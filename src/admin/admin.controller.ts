import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddProductDto } from './DTO/addProduct.dto';
import { AddCompanyDto } from './DTO/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('getCompanies')
  async getCompanies(): Promise<any>{
    return this.adminService.getCompanies();
  }
  @Get('getUsers')
  async getUsers(): Promise<any>{
    return this.adminService.getUsers();
  }

  @Post('addCompany')
  async addCompany(@Body() addCompanyDto: AddCompanyDto): Promise<any> {
    return this.adminService.addCompany(addCompanyDto);
  }
  @Post('addProduct/:id')
  async addProduct(@Param('id') companyId: String,
    @Body() addProductDto: AddProductDto): Promise<any> {
    return this.adminService.addProductToCompany(companyId, addProductDto);
  }
  @Delete('removeCompany/:id')
  async removeCompany(@Param('id')companyId:String){
    return this.adminService.removeCompany(companyId);
  }
}
