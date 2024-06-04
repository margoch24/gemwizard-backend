import { REVIEWS_DATA } from '../constants';
import { app, request, expect, getHeaders, Review } from '../initializer';

describe('GET /reviews', async () => {
  it('Get reviews successfully', async () => {
    const headers = await getHeaders();

    await Review.create(REVIEWS_DATA);

    const res = await request(app).get('/reviews').set(headers);

    const { error, data } = res.body;

    expect(error).eq(0);
    expect(data.length).eq(REVIEWS_DATA.length);

    REVIEWS_DATA.forEach((review) => Object.keys(review).length > 10);
  });

  it('Get reviews empty list', async () => {
    const headers = await getHeaders();

    const res = await request(app).get('/reviews').set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);
    expect(data.length).eq(0);
  });
});
