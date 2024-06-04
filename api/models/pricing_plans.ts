'use strict';

import mongoose from 'mongoose';
import { PLANS_BILLING_CYCLE_ENUM } from '../types/pricing_plans_types';

export const BILLING_CYCLES = Object.values(PLANS_BILLING_CYCLE_ENUM);
export type BillingCycleType = PLANS_BILLING_CYCLE_ENUM[keyof PLANS_BILLING_CYCLE_ENUM];

export interface IPricingPlan {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  subtitle: string;
  price: number;
  priceDetails: string;
  currency: string;
  description: string;
  billingCycle: BillingCycleType;
  recommended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingPlanSchema = new mongoose.Schema<IPricingPlan>(
  {
    title: { type: String },
    subtitle: { type: String },
    price: { type: Number },
    priceDetails: { type: String },
    currency: { type: String },
    description: { type: String },
    billingCycle: { type: String, enum: BILLING_CYCLES },
    recommended: { type: Boolean }
  },
  { timestamps: true }
);

export default mongoose.model<IPricingPlan>('PricingPlan', PricingPlanSchema);
