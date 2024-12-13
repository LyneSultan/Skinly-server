import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
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
  @Delete('removeCompany/:id')
  async removeCompany(@Param('id')companyId:String){
    return this.adminService.removeCompany(companyId);
  }
}
