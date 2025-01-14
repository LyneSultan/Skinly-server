import { Body, Controller, Get, Param, Post, Request, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TokenInterceptor } from 'src/auth/services/token.service';
import { AdvertisementService } from './advertisement.service';
import { AddAdvertisementDto } from './DTO/AddAdvertisement.dto';

@Controller('advertisement')
export class AdvertisementController {
  constructor(private readonly advertsiementService: AdvertisementService) { }

  @Post('/:product')
  @UseInterceptors(
    TokenInterceptor,
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, file.originalname);
        },
      }),
    })
  )
  async addAds(@Request() req,@Param('product') productName: string  ) {

    return await this.advertsiementService.addAdvertisementToProduct(
      req.user.sub,
      productName,
      req.file.path
    );
  }

  @Get('/:companyId/:product')
  async getproductAds(
    @Param('companyId') companyId: string,
    @Param('product') productName: string,
    @Body() addDto:AddAdvertisementDto) {
    return  await this.advertsiementService.getAdvertisementForProduct(companyId, productName);
  }
}
