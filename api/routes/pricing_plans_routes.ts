'use strict';

import { getPricingPlans } from '../controllers/pricing_plans_controller';
import { Router } from 'express';

const router = Router();

router.route('/pricing-plans').get(getPricingPlans);

export default router;
