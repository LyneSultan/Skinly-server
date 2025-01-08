import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiLogs, AiLogsSchema } from 'schema/aiLogs.schema';
import { AuthModule } from 'src/auth/auth.module';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: AiLogs.name, schema: AiLogsSchema }]),HttpModule,AuthModule],
  providers: [OcrService],
  controllers: [OcrController]
})
export class OcrModule {}
