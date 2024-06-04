import { app, request, expect, getHeaders, FETCH_DIAMONDS_SECRET_KEY } from '../initializer';

describe('POST /fetch-diamonds', async () => {
  // it('Fetching diamonds successfully', async () => {
  //   const headers = { ...(await getHeaders()), fetch_diamonds: FETCH_DIAMONDS_SECRET_KEY as string };

  //   const filePath = path.join(__dirname, './data/test_data.xlsx');

  //   const res = await request(app).post('/fetch-diamonds').set(headers).attach('xlsx', filePath);
  //   const { error, data } = res.body;
  //   expect(error).eq(0);
  //   expect(data.message).eq('The data has been saved to database successfully');

  //   const diamonds = await Diamond.find({});
  //   const prices = await Price.find({});

  //   expect(diamonds.length).equal(2);
  //   expect(prices.length).eq(2);

  //   const [diamondOne, diamondTwo] = diamonds;
  //   const [priceOne, priceTwo] = prices;

  //   expect(diamondOne.certificateId).eq('AGS ID 104118539045');
  //   const { length, width, depth, unit } = diamondTwo.dimensions.measurements;
  //   expect(length).eq(4.42);
  //   expect(width).eq(4.45);
  //   expect(depth).eq(2.78);
  //   expect(unit).eq('mm');

  //   expect(priceOne.diamondId.toString()).eq(diamondOne._id.toString());
  //   expect(priceTwo.diamondId.toString()).eq(diamondTwo._id.toString());
  // });

  it('Passing without a file', async () => {
    const headers = { ...(await getHeaders()), fetch_diamonds: FETCH_DIAMONDS_SECRET_KEY as string };

    const res = await request(app).post('/fetch-diamonds').set(headers);
    const { error, data } = res.body;
    expect(error).eq(1);
    expect(data.message).eq('No file uploaded');
  });

  it('Passing wrong headers', async () => {
    const headers = { ...(await getHeaders()) };

    const res = await request(app).post('/fetch-diamonds').set(headers);
    const { error, data } = res.body;
    expect(error).eq(1);
    expect(data.message).eq('Insufficient permissions');
  });

  // it('Passing empty file', async () => {
  //   const headers = { ...(await getHeaders()), fetch_diamonds: FETCH_DIAMONDS_SECRET_KEY as string };

  //   const filePath = path.join(__dirname, './data/empty_data.xlsx');

  //   const res = await request(app).post('/fetch-diamonds').set(headers).attach('xlsx', filePath);
  //   const { error, data } = res.body;
  //   expect(error).eq(0);
  //   expect(data.message).eq('The data has been saved to database successfully');

  //   const diamonds = await Diamond.find({});
  //   const prices = await Price.find({});
  //   expect(diamonds.length).equal(0);
  //   expect(prices.length).equal(0);
  // });
});
