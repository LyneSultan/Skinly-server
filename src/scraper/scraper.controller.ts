import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploaded file:', file);

    if (!file.buffer) {
      throw new BadRequestException('No file buffer found');
    }

    const data = await this.scraperService.scrape(file);
    return { data };
  }
}
