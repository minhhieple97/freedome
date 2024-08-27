import { BaseDocument, baseSchemaOptions } from '@freedome/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type BuyerDocument = Buyer & Document;

@Schema(baseSchemaOptions())
export class Buyer extends BaseDocument {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ default: false })
  isSeller: boolean;

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  purchasedGigs: mongoose.Types.ObjectId[];
}

export const BuyerSchema = SchemaFactory.createForClass(Buyer);
