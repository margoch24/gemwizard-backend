import { Response, Request } from 'express';
import PricingPlansService from '../services/pricing_plans_service';

const getPricingPlans = async (req: Request, res: Response) => {
  const { code, response } = await PricingPlansService.getPlans();

  return res.status(code).json(response);
};

export { getPricingPlans };
