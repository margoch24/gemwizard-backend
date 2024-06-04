import { Review } from '../models';
import { IReview } from 'models/reviews';

const ReviewsService = {
  getReviews: async () => {
    return await getReviews();
  }
};

export default ReviewsService;

const getReviews = async () => {
  let reviews = null;
  try {
    reviews = await Review.find({}).sort({ createdAt: -1 });
  } catch (err) {
    console.log(err);
  }

  if (!reviews) {
    const response = { error: 1, data: { message: 'Internal server error' } };
    return { code: 500, response };
  }

  const response = { error: 0, data: reviews.map((review) => mapReviewObjectToResponseObject(review)) };
  return { code: 200, response };
};

const mapReviewObjectToResponseObject = ({
  _id,
  userId,
  name,
  age,
  savings,
  imageURL,
  message,
  createdAt,
  updatedAt
}: IReview) => ({
  _id,
  userId,
  name,
  age,
  savings,
  imageURL,
  message,
  createdAt,
  updatedAt
});
