import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';

@Injectable()
export class SkinTypeDetectionService {
  constructor(private readonly httpService: HttpService) {}

  async getSkinType(file: Express.Multer.File){
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const url = process.env.DJANGO_API_SKIN_DETECTION;
    const formData = new FormData();
    formData.append('image', file.buffer, file.originalname);

    try {
      const response = await this.httpService.post(url, formData, {
        headers: formData.getHeaders(),
      }).toPromise();
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException('Error getting skin type: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
