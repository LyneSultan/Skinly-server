import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface Product {
  name: string;
  price: number;
  rating: number;
  description?: string;
  additional_info?: {
    advertisement: string;
  };
}

@Schema()
export class Company extends Document {
  @Prop()
  name: string;

  @Prop()
  scraping_file: string;

  @Prop({ type: Array, default:[] })
  products: Product[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
