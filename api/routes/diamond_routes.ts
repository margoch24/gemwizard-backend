'use strict';

import { getDiamondSchema, getDiamondsSchema, searchDiamondSchema } from '../schemas';
import {
  fetchDiamonds,
  getDiamond,
  getDiamonds,
  searchDiamond,
  upload,
  getTotalDiamondsCount
} from '../controllers/diamonds_controller';
import { Router } from 'express';
import validate from '../middlewares/validate';

const router = Router();

router.route('/diamonds').get(getDiamondsSchema, validate, getDiamonds);
router.route('/diamond').get(getDiamondSchema, validate, getDiamond);
router.route('/search-diamond').get(searchDiamondSchema, validate, searchDiamond);
router.route('/fetch-diamonds').post(upload.single('xlsx'), fetchDiamonds);
router.route('/total-diamonds-count').get(getTotalDiamondsCount);

export default router;
