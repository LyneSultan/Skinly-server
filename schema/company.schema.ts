import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type Product ={
  name: string;
  price: number;
  link: string;
  rating?: number;
  description?: string;
  additional_info?: {
    advertisement: string;
  };
}

@Schema()
export class Company extends Document {
  @Prop({ required: true, unique:true })
  name: string;

  @Prop({ required: true })
  scraping_file: string;

  @Prop({ type: Array, default:[] })
  products: Product[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  user:  User;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
