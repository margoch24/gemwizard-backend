import { IDiamond } from '../../api/models/diamonds';
import { IPrice } from '../../api/models/prices';
import { app, request, expect, getHeaders, createData } from '../initializer';

describe('GET /search-diamond', async () => {
  it('Search diamond successfully', async () => {
    const headers = await getHeaders();

    const { diamond, price } = await createData();

    const query = `?reportNumber=${diamond.reportNumber}`;
    const res = await request(app)
      .get('/search-diamond' + query)
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

  it('Passing empty params', async () => {
    const headers = await getHeaders();

    const res = await request(app).get('/search-diamond').set(headers);

    const { error, data } = res.body;
    expect(error).eq(1);

    const [requiredError, validError] = data;
    expect(requiredError.msg).eq('reportNumber is required');
    expect(validError.msg).eq('reportNumber must be valid string');
  });

  it('Search deleted diamond', async () => {
    const headers = await getHeaders();

    const { diamond } = await createData({ isDeleted: true });

    const query = `?reportNumber=${diamond.reportNumber}`;
    const res = await request(app)
      .get('/search-diamond' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data).eq(null);
  });

  it('Search diamond with similar report number to already existing one', async () => {
    const headers = await getHeaders();

    await createData();

    const query = `?reportNumber=LG591375122`;
    const res = await request(app)
      .get('/search-diamond' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data).eq(null);
  });

  it('Search non-existing diamond', async () => {
    const headers = await getHeaders();

    const query = `?reportNumber=LG591375123`;
    const res = await request(app)
      .get('/search-diamond' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data).eq(null);
  });
});
