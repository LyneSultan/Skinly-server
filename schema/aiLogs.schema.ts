import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as MongooseSchema from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema'; // Assuming you have a User schema

@Schema()
export class AiLogs extends Document {
  @Prop({
    type: {
      request: {
        userInput: { type: [String], required: true },
        userSkinType: { type: String, required: true },
        user: { type: MongooseSchema.Types.ObjectId, ref: 'User', required: true },
      },
      response: { type: String, required: true },
    },
    required: true,
  })
  chats: {
    request: {
      userInput: [string];
      userSkinType: string;
      user: User;
    };
    response: string;
  };
}

export const AiLogsSchema = SchemaFactory.createForClass(AiLogs);
