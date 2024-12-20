import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';

@Module({
  imports: [HttpModule],
  providers: [OcrService],
  controllers: [OcrController]
})
export class OcrModule {}
