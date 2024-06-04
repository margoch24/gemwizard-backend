'use strict';

import mongoose from 'mongoose';

export interface IPhoto {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  diamondId: mongoose.Schema.Types.ObjectId;
  photos: { url: string }[];
  createdAt: number;
  updatedAt: number;
}

const PhotoSchema = new mongoose.Schema<IPhoto>(
  {
    userId: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId
    },
    diamondId: {
      ref: 'Diamond',
      type: mongoose.Schema.Types.ObjectId
    },
    photos: { type: [{ url: String }] }
  },
  { timestamps: true }
);

export default mongoose.model<IPhoto>('Photo', PhotoSchema);
