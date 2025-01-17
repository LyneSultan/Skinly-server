import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Company } from 'schema/company.schema';
import { AdminGuard } from 'src/auth/admin.guard';
import { TokenInterceptor } from 'src/auth/services/token.service';
import { CompanyService } from './company.service';
import { addCompany } from './DTO/addCompany.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/')
  @UseGuards(AdminGuard)
  async getCompanies() {

    return this.companyService.getCompanies();
  }

  @Post('/')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addCompany(@Body() addCompanyDto: addCompany, @UploadedFile() file: Express.Multer.File) {

    return this.companyService.addCompany(addCompanyDto, file);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async removeCompany(@Param('id') companyId: String) {

    return this.companyService.removeCompany(companyId);
  }

  @Patch()
  @UseInterceptors(TokenInterceptor)
  async updateUser(@Request() req, @Body() updateData: Partial<Company>) {

    const companyId = req.user.sub;
    return this.companyService.updateCompany(companyId, updateData);
  }


}
