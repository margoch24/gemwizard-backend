'use strict';

import { DIAMOND_TYPES_ENUM } from '../types/diamond_types';
import mongoose from 'mongoose';

export const DIAMOND_TYPES = Object.values(DIAMOND_TYPES_ENUM);
export type DiamondTypeType = DIAMOND_TYPES_ENUM[keyof DIAMOND_TYPES_ENUM];

export interface IDiamond {
  _id: mongoose.Schema.Types.ObjectId;
  certificateId: string;
  diamondURL: string;
  certLaboratory: string;
  certificateDate: string;
  type: DiamondTypeType;
  imageURL: string;
  affiliateLink: string;
  reportNumber: string;
  seller: string;
  dimensions: {
    lengthWidthRatio: number;
    measurements: {
      length: number;
      width: number;
      depth: number;
      unit: string;
    };
    carat: number;
    visualCarat: number;
    tablePercentage: number;
    depthPercentage: number;
    culet: string;
    pavilionDepthPercentage: number;
    pavilionAngle: number;
    crownHeightPercentage: number;
    crownAngle: number;
    lowerHalfPercentage: number;
    starLengthPercentage: number;
    girdlePercentage: number;
  };
  characteristics: {
    shape: string;
    color: string;
    clarity: string;
    fluorescence: string;
    symmetry: string;
    polish: string;
    cutGrade: string;
    cutScore: number;
    clarityCharacteristics: string[];
  };
  inscription: string;
  comments: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DiamondSchema = new mongoose.Schema<IDiamond>(
  {
    certificateId: { type: String },
    diamondURL: { type: String },
    certLaboratory: { type: String },
    certificateDate: { type: String },
    type: { type: String, enum: DIAMOND_TYPES },
    imageURL: { type: String },
    affiliateLink: { type: String },
    reportNumber: { type: String },
    seller: { type: String },
    dimensions: {
      lengthWidthRatio: { type: Number },
      measurements: {
        length: { type: Number },
        width: { type: Number },
        depth: { type: Number },
        unit: { type: String }
      },
      carat: { type: Number },
      visualCarat: { type: Number },
      tablePercentage: { type: Number },
      depthPercentage: { type: Number },
      culet: { type: String, default: 'none' },
      pavilionDepthPercentage: { type: Number },
      pavilionAngle: { type: Number },
      crownHeightPercentage: { type: Number },
      crownAngle: { type: Number },
      lowerHalfPercentage: { type: Number },
      starLengthPercentage: { type: Number },
      girdlePercentage: { type: Number }
    },
    characteristics: {
      shape: { type: String },
      color: { type: String },
      clarity: { type: String },
      fluorescence: { type: String, default: 'none' },
      symmetry: { type: String },
      polish: { type: String },
      cutGrade: { type: String },
      cutScore: { type: Number },
      clarityCharacteristics: { type: [String] }
    },
    inscription: { type: String },
    comments: { type: String },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IDiamond>('Diamond', DiamondSchema);
