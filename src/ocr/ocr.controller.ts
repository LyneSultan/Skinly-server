import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly  ocrService:OcrService){}

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  performOcr(@UploadedFile() file: Express.Multer.File) {
    return this.ocrService.performOcr(file);
  }
}
