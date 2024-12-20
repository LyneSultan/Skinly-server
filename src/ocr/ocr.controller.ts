import { Body, Controller, Post } from '@nestjs/common';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly  ocrService:OcrService){}

  @Post('')
  performOcr(@Body("image_path") image_path: string) {
    return this.ocrService.performOcr(image_path);
  }
}
