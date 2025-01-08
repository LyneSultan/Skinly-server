import { Controller, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenInterceptor } from 'src/auth/services/token.service';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly  ocrService:OcrService){}

  @Post('')
  @UseInterceptors(TokenInterceptor,FileInterceptor('image'))
  performOcr(@Request() req,@UploadedFile() file: Express.Multer.File) {
    return this.ocrService.performOcr(req.user.sub,file);
  }
}
