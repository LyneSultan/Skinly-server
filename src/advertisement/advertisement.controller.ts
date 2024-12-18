import { Body, Controller, Param, Post } from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import { AddAdvertisementDto } from './DTO/AddAdvertisement.dto';

@Controller('advertisement')
export class AdvertisementController {
  constructor(private readonly advertsiementService: AdvertisementService) { }

  @Post('addAds/:companyId/:product')
  async addAds(
    @Param('companyId') companyId: string,
    @Param('product') productName: string,
    @Body() addDto:AddAdvertisementDto): Promise<any> {
    return  await this.advertsiementService.addAdvertisementToProduct(companyId, productName, addDto);
  }
}
