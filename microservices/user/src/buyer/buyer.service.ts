import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Buyer, BuyerDocument } from './buyer.schema';

@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(Buyer.name) private buyerModel: Model<BuyerDocument>,
  ) {}

  async create(buyer: Buyer): Promise<Buyer> {
    const createdBuyer = new this.buyerModel(buyer);
    return createdBuyer.save();
  }

  async findAll(): Promise<Buyer[]> {
    return this.buyerModel.find().exec();
  }

  async findById(id: string): Promise<Buyer> {
    return this.buyerModel.findById(id).exec();
  }

  // Add more methods as needed
}
