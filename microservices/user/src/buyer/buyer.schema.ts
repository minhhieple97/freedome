import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type BuyerDocument = Buyer & Document;

@Schema({ versionKey: false, timestamps: true })
export class Buyer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ default: false })
  isSeller: boolean;

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  purchasedGigs: mongoose.Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const BuyerSchema = SchemaFactory.createForClass(Buyer);
