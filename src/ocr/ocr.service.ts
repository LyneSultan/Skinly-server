import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';

@Injectable()
export class OcrService {
  constructor(private readonly httpService: HttpService) {}

  async performOcr(file: Express.Multer.File){
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const url = 'http://127.0.0.1:8000/api/easyOcr';
    const formData = new FormData();
    formData.append('image', file.buffer, file.originalname);

    try {
      const response = await this.httpService.post(url, formData, {
        headers: formData.getHeaders(),
      }).toPromise();
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException('Error' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
