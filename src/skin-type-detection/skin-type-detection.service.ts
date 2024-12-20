import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class SkinTypeDetectionService {
  constructor(private readonly httpService: HttpService) {}

  getSkintype(image_path: string): Observable<any> {
    if (!image_path) {
      throw new HttpException("did not find the image", HttpStatus.NOT_FOUND);
    }

    const url = 'http://127.0.0.1:8000/api/skinType';

    return this.httpService.post(url, { image_path }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error:', error);
        return throwError(() => new HttpException("Error getting skin type: " + error.message, HttpStatus.INTERNAL_SERVER_ERROR));
      }),
    );
  }
}
