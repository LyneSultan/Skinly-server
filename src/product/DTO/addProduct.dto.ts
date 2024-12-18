import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  additional_info: {
    advertisement: string;
  };
}
