import { Response, Request } from 'express';
import ReviewsService from '../services/reviews_service';

const getReviews = async (req: Request, res: Response) => {
  const { code, response } = await ReviewsService.getReviews();

  return res.status(code).json(response);
};

export { getReviews };
