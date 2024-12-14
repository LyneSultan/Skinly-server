import { Body, Controller, Param, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AddAdvertisementDto } from './DTO/AddAdvertisement.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Post('addAds/:companyId/:product')
  async addAds(
    @Param('companyId') companyId: string,
    @Param('product') productName: string,
    @Body() addDto:AddAdvertisementDto): Promise<any> {
    return  await this.companyService.addAdvertisementToProduct(companyId, productName, addDto);
  }
}
