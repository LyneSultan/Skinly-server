import { Body, Controller, Post } from '@nestjs/common';
import { SkinTypeDetectionService } from './skin-type-detection.service';

@Controller('skinDetection')
export class SkinTypeDetectionController {
  constructor(private readonly skinTypeService:SkinTypeDetectionService){}
  @Post('')
  async detectSkinType(@Body('image_path')image_path:string) {
    return this.skinTypeService.getSkintype(image_path);
  }

}
