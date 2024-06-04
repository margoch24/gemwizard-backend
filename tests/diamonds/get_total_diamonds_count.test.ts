import { app, request, expect, getHeaders, Diamond } from '../initializer';

describe('GET /total-diamonds-count', async () => {
  it('Get total diamonds count successfully', async () => {
    const headers = await getHeaders();
    const diamonds = [
      {
        certificateId: 'AGS ID 591375136'
      },
      {
        certificateId: 'AGS ID 591375139'
      },
      {
        certificateId: 'AGS ID 591375134'
      },
      {
        certificateId: 'AGS ID 591375135'
      },
      {
        certificateId: 'AGS ID 591375131'
      },
      {
        certificateId: 'AGS ID 591375132'
      },
      {
        certificateId: 'AGS ID 591375133'
      }
    ];
    await Diamond.create(diamonds);

    const res = await request(app).get('/total-diamonds-count').set(headers);

    const { error, data } = res.body;

    expect(error).eq(0);
    const { totalDiamondsCount } = data;
    expect(totalDiamondsCount).eq(diamonds.length);
  });

  it('Get total diamonds count with diamonds empty list', async () => {
    const headers = await getHeaders();

    const res = await request(app).get('/total-diamonds-count').set(headers);

    const { error, data } = res.body;

    expect(error).eq(0);
    const { totalDiamondsCount } = data;
    expect(totalDiamondsCount).eq(0);
  });
});
