import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AddCompanyDto } from './DTO/addCompany.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Get('/')
  async getCompanies(): Promise<any> {
    return this.companyService.getCompanies();
  }

  @Post('/')
  async addCompany(@Body() addCompanyDto: AddCompanyDto): Promise<any> {
    return this.companyService.addCompany(addCompanyDto);
  }

 @Delete('/:id')
  async removeCompany(@Param('id')companyId:String){
    return this.companyService.removeCompany(companyId);
  }

}
