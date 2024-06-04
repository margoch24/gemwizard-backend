'use strict';

import mongoose from 'mongoose';

export interface IPrice {
  _id: mongoose.Schema.Types.ObjectId;
  diamondId: mongoose.Schema.Types.ObjectId;
  date: string;
  price: number;
  estimateRange: {
    min: number;
    max: number;
  };
  fairPrice: number;
  priceDetails: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const PriceSchema = new mongoose.Schema<IPrice>(
  {
    diamondId: {
      ref: 'Diamond',
      type: mongoose.Schema.Types.ObjectId
    },
    date: { type: String, default: new Date().toISOString() },
    price: { type: Number },
    estimateRange: {
      min: { type: Number },
      max: { type: Number }
    },
    fairPrice: { type: Number },
    priceDetails: { type: String },
    currency: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IPrice>('Price', PriceSchema);
