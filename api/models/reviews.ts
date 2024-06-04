'use strict';

import mongoose from 'mongoose';

export interface IReview {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  age: number;
  savings: {
    saved: number;
    currency: string;
  };
  imageURL: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>(
  {
    userId: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId
    },
    name: { type: String },
    age: { type: Number },
    imageURL: { type: String },
    message: { type: String },
    savings: {
      saved: { type: Number },
      currency: { type: String }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
