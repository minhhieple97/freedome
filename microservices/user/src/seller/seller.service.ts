import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seller, SellerDocument } from './seller.schema';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller.name) private sellerModel: Model<SellerDocument>,
  ) {}

  async create(seller: Seller): Promise<Seller> {
    const createdSeller = new this.sellerModel(seller);
    return createdSeller.save();
  }

  async findAll(): Promise<Seller[]> {
    return this.sellerModel.find().exec();
  }

  async findById(id: string): Promise<Seller> {
    return this.sellerModel.findById(id).exec();
  }

  // Add more methods as needed
}
