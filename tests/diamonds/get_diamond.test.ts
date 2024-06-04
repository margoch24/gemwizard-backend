import { IDiamond } from '../../api/models/diamonds';
import { IPrice } from '../../api/models/prices';
import { app, request, expect, getHeaders, createData, Price } from '../initializer';

describe('GET /diamond', async () => {
  it('Get diamond successfully', async () => {
    const headers = await getHeaders();

    const { diamond, price } = await createData();

    const query = `?diamondId=${diamond._id}`;
    const res = await request(app)
      .get('/diamond' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    const { dimensions, characteristics } = diamond;
    const { dimensions: dataDimensions, characteristics: dataCharacteristics, prices } = data;

    expect(prices.length).eq(1);
    Object.entries(dimensions).forEach(([key, value]) => {
      if (key === 'measurements') {
        expect(dataDimensions.measurements.depth).eq(dimensions.measurements.depth);
        expect(dataDimensions.measurements.length).eq(dimensions.measurements.length);
        expect(dataDimensions.measurements.width).eq(dimensions.measurements.width);
        expect(dataDimensions.measurements.unit).eq(dimensions.measurements.unit);
        return;
      }
      expect(dataDimensions[key]).eq(value);
    });

    Object.entries(characteristics).forEach(([key, value]) => {
      if (key === 'clarityCharacteristics') {
        expect(characteristics.clarityCharacteristics.join(' ')).eq(
          dataCharacteristics.clarityCharacteristics.join(' ')
        );
        return;
      }
      expect(dataCharacteristics[key]).eq(value);
    });

    const [resPrice] = prices;

    type OptionalIPrice = Partial<IPrice> & { __v?: number };
    const modifiedPrice: OptionalIPrice = { ...price.toObject() };
    delete modifiedPrice['createdAt'];
    delete modifiedPrice['updatedAt'];
    delete modifiedPrice['__v'];

    Object.entries(modifiedPrice).forEach(([key, value]) => {
      if (['_id', 'diamondId'].includes(key)) {
        expect(resPrice[key].toString()).eq(value?.toString());
        return;
      }

      if (key === 'estimateRange') {
        expect(price.estimateRange.max).eq(resPrice.estimateRange.max);
        expect(price.estimateRange.min).eq(resPrice.estimateRange.min);
        return;
      }
      expect(resPrice[key]).eq(value);
    });

    type OptionalIDiamond = Partial<IDiamond> & { prices?: IPrice[]; __v?: number };
    const modifiedDiamond: OptionalIDiamond = { ...diamond.toObject() };

    delete modifiedDiamond['createdAt'];
    delete modifiedDiamond['updatedAt'];
    delete modifiedDiamond['characteristics'];
    delete modifiedDiamond['dimensions'];
    delete modifiedDiamond['prices'];
    delete modifiedDiamond['__v'];

    Object.entries(modifiedDiamond).forEach(([key, value]) => {
      if (key === '_id') {
        expect(data[key].toString()).eq(value?.toString());
        return;
      }
      expect(data[key]).eq(value);
    });
  });

  it('Passing wrong params', async () => {
    const headers = await getHeaders();

    const query = `?diamondId=456`;
    const res = await request(app)
      .get('/diamond' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(1);

    const [validError] = data;
    expect(data.length).eq(1);
    expect(validError.msg).eq('diamondId must be valid id');
  });

  it('Passing empty params', async () => {
    const headers = await getHeaders();

    const res = await request(app).get('/diamond').set(headers);

    const { error, data } = res.body;
    expect(error).eq(1);

    expect(data.length).eq(2);
    const [requiredError, validError] = data;
    expect(requiredError.msg).eq('diamondId is required');
    expect(validError.msg).eq('diamondId must be valid id');
  });

  it('Get deleted diamond', async () => {
    const headers = await getHeaders();

    const { diamond } = await createData({ isDeleted: true });

    const query = `?diamondId=${diamond._id}`;
    const res = await request(app)
      .get('/diamond' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data).eq(null);
  });

  it('Get non-existing diamond', async () => {
    const headers = await getHeaders();

    const query = `?diamondId=65da3a223f5959b10dcc7a61`;
    const res = await request(app)
      .get('/diamond' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data).eq(null);
  });

  it('Get diamond successfully with 2 prices', async () => {
    const headers = await getHeaders();

    const { diamond } = await createData();
    const secondPriceParams = {
      diamondId: diamond._id,
      date: '2023-01-23T21:09:30.128Z',
      price: 400,
      fairPrice: 650,
      priceDetails: 'Price Details'
    };

    await Price.create(secondPriceParams);

    const query = `?diamondId=${diamond._id}`;
    const res = await request(app)
      .get('/diamond' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    const [latestPrice, secondPrice] = data.prices;
    expect(+new Date(latestPrice.date) > +new Date(secondPrice.date)).eq(true);
  });
});
