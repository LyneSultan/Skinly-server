import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { addCompany } from './DTO/addCompany.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Get('/')
  async getCompanies(){
    return this.companyService.getCompanies();
  }

  @Post('/')
  async addCompany(@Body() addCompanyDto: addCompany) {
    return this.companyService.addCompany(addCompanyDto);
  }

 @Delete('/:id')
  async removeCompany(@Param('id')companyId:String){
    return this.companyService.removeCompany(companyId);
  }

}
