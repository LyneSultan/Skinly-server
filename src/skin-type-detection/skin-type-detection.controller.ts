import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkinTypeDetectionService } from './skin-type-detection.service';

@Controller('skinDetection')
export class SkinTypeDetectionController {
  constructor(private readonly skinTypeService: SkinTypeDetectionService) { }

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async detectSkinType(@UploadedFile() file: Express.Multer.File) {
    return this.skinTypeService.getSkinType(file);
  }

}
