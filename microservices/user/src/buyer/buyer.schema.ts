import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type BuyerDocument = Buyer & Document;

@Schema({ versionKey: false })
export class Buyer {
  @Prop({ required: true, index: true })
  username: string;

  @Prop({ required: true, index: true })
  email: string;

  @Prop({ required: true })
  country: string;

  @Prop({ default: false })
  isSeller: boolean;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }])
  purchasedGigs: mongoose.Types.ObjectId[];

  @Prop({ type: Date })
  createdAt: Date;
}

export const BuyerSchema = SchemaFactory.createForClass(Buyer);
