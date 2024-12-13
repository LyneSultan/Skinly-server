import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddCompanyDto } from './DTO/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('addCompany')
  async addCompany(@Body() addCompanyDto: AddCompanyDto): Promise<any> {
    return this.adminService.addCompany(addCompanyDto);
  }
}
