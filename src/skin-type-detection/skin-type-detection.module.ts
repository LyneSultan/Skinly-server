import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SkinTypeDetectionController } from './skin-type-detection.controller';
import { SkinTypeDetectionService } from './skin-type-detection.service';

@Module({
  imports: [HttpModule],
  providers: [SkinTypeDetectionService],
  controllers: [SkinTypeDetectionController]
})
export class SkinTypeDetectionModule {
}
