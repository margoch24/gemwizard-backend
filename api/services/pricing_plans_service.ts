import { IPricingPlan } from 'models/pricing_plans';
import { PricingPlan } from '../models';

const PricingPlansService = {
  getPlans: async () => {
    return await getPlans();
  }
};

export default PricingPlansService;

const getPlans = async () => {
  let pricingPlans = null;
  try {
    pricingPlans = await PricingPlan.find({});
  } catch (err) {
    console.log(err);
  }

  if (!pricingPlans) {
    const response = { error: 1, data: { message: 'Internal server error' } };
    return { code: 500, response };
  }

  const response = { error: 0, data: pricingPlans.map((pricingPlan) => mapPlansObjectToResponseObject(pricingPlan)) };
  return { code: 200, response };
};

const mapPlansObjectToResponseObject = ({
  _id,
  title,
  subtitle,
  price,
  priceDetails,
  currency,
  description,
  billingCycle,
  recommended,
  createdAt,
  updatedAt
}: IPricingPlan) => ({
  _id,
  title,
  subtitle,
  price,
  priceDetails,
  currency,
  description,
  billingCycle,
  recommended,
  createdAt,
  updatedAt
});
