import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from "mongoose";


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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Company', required: false })
  companyId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
