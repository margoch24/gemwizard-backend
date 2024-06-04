'use strict';

import mongoose from 'mongoose';

export interface IContactUs {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactUsSchema = new mongoose.Schema<IContactUs>(
  {
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    message: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IContactUs>('ContactUs', ContactUsSchema);
