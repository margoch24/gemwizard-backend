'use strict';

import { getReviews } from '../controllers/reviews_controller';
import { Router } from 'express';

const router = Router();

router.route('/reviews').get(getReviews);

export default router;
