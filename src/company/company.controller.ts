import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { Company } from 'schema/company.schema';
import { AdminGuard } from 'src/auth/admin.guard';
import { TokenInterceptor } from 'src/auth/services/token.service';
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
  @UseGuards(AdminGuard)
  async addCompany(@Body() addCompanyDto: addCompany) {
    return this.companyService.addCompany(addCompanyDto);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async removeCompany(@Param('id')companyId:String){
    return this.companyService.removeCompany(companyId);
  }

  @Patch()
  @UseInterceptors(TokenInterceptor)
  async updateUser(@Request() req,@Body() updateData: Partial<Company>) {
      const companyId = req.user.sub;
      return this.companyService.updateCompany(companyId, updateData);
  }
}
