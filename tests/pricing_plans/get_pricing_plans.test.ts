import { PRICING_PLANS_DATA } from '../constants';
import { app, request, expect, getHeaders, PricingPlan } from '../initializer';

describe('GET /pricing-plans', async () => {
  it('Get pricing plans successfully', async () => {
    const headers = await getHeaders();

    await PricingPlan.create(PRICING_PLANS_DATA);

    const res = await request(app).get('/pricing-plans').set(headers);

    const { error, data } = res.body;

    expect(error).eq(0);
    expect(data.length).eq(PRICING_PLANS_DATA.length);

    PRICING_PLANS_DATA.forEach((plan) => Object.keys(plan).length > 10);
  });

  it('Get pricing plans empty list', async () => {
    const headers = await getHeaders();

    const res = await request(app).get('/pricing-plans').set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);
    expect(data.length).eq(0);
  });
});
