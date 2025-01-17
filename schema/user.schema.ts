import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, } from "mongoose";


@Schema()
export class User extends Document{
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true , unique:true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/})
  email: string;

  @Prop({default:"user",enum:["user","admin","company"]})
  user_type: string;

  @Prop({enum:["oily","normal","dry"]})
  skin_type: string;

  @Prop()
  profile_pircture: string;

  @Prop({default: false})
  ban: Boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
