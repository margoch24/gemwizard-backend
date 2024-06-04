'use strict';

import { postContactUs } from '../controllers/contact_us_controller';
import { Router } from 'express';
import validate from '../middlewares/validate';
import { postContactUsSchema } from '../schemas';

const router = Router();

router.route('/contact').post(postContactUsSchema, validate, postContactUs);

export default router;
