import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, } from "mongoose";


@Schema()
export class User extends Document{
  @Prop({ required: true })
  name: String;

  @Prop({ required: true })
  password: String;

  @Prop({ required: true , unique:true})
  email: String;

  @Prop({default:"user",enum:["user","admin","company"]})
  user_type: String;

  @Prop({enum:["oily","normal","dry"]})
  skin_type: String;

  @Prop()
  profile_pircture: String;

  @Prop({default: false})
  ban: Boolean;


}

export const UserSchema = SchemaFactory.createForClass(User);
