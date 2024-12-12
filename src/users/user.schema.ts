import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";


@Schema()
export class User extends Document{
  @Prop()
  name: String;

  @Prop()
  password: String;

  @Prop()
  user_type: String;

  @Prop()
  skin_type: String;

  @Prop()
  profile_pircture: String;

  @Prop()
  ban: Boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
