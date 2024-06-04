import { DIAMOND_TYPES_ENUM } from '../../api/types/diamond_types';
import { IPrice } from '../../api/models/prices';
import { app, request, expect, getHeaders, createData, Price, Diamond } from '../initializer';

const newDiamondProps = {
  certificateId: 'AGS ID 591375136',
  certLaboratory: 'AGS',
  certificateDate: 'Tue Jul 18 2023 03:00:00 GMT+0300 (Eastern European Summer Time)',
  type: 'natural diamond',
  reportNumber: '591375136',
  dimensions: {
    carat: 4.2,
    visualCarat: 1.32,
    tablePercentage: 0.75,
    depthPercentage: 0.9,
    culet: 'none',
    pavilionDepthPercentage: 0.9,
    crownHeightPercentage: 0.88,
    girdlePercentage: 0.09
  },
  characteristics: {
    shape: 'oval',
    color: 'H',
    clarity: 'VVS1',
    fluorescence: 'very strong',
    symmetry: 'excellent',
    polish: 'excellent',
    cutGrade: 'Very Good',
    cutScore: 7.1,
    clarityCharacteristics: ['cloud', 'needle', 'feather']
  }
};

const newPriceProps = {
  date: '2023-01-23T21:09:30.128Z',
  price: 1000,
  fairPrice: 1500,
  priceDetails: 'Price Details'
};

describe('GET /diamonds', async () => {
  it('Get diamonds successfully', async () => {
    const headers = await getHeaders();

    const { diamond, price } = await createData();
    const secondPriceParams = {
      diamondId: diamond._id,
      date: '2023-01-23T21:09:30.128Z',
      price: 400,
      fairPrice: 650,
      priceDetails: 'Price Details'
    };
    await Price.create(secondPriceParams);

    await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    const query = '?limit=50';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(2);
    const [diamondTwo, diamondOne] = data;

    expect(diamondOne.priceProperties._id.toString()).eq(price._id.toString());
    expect(!!diamondTwo.priceProperties).eq(true);
  });

  it('Passing wrong params', async () => {
    const headers = await getHeaders();

    const query = '?limit=50&lastRecordId=456';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(1);

    expect(data.length).eq(1);

    const [lastRecordIdError] = data;
    expect(lastRecordIdError.msg).eq('lastRecordId must be valid id');
  });

  it('Passing empty params', async () => {
    const headers = await getHeaders();

    const query = '?lastRecordId=';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(1);

    expect(data.length).eq(2);

    const [limitError, lastRecordIdError] = data;
    expect(limitError.msg).eq('limit is required');
    expect(lastRecordIdError.msg).eq('lastRecordId must be valid id');
  });

  it('Get diamonds with limit', async () => {
    const headers = await getHeaders();

    await createData();
    const { diamond } = await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    const diamonds = await Diamond.find({});
    expect(diamonds.length).eq(2);

    const query = '?limit=1';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(1);
    const [reveivedDiamond] = data;

    expect(reveivedDiamond._id.toString()).eq(diamond._id.toString());
    expect(!!reveivedDiamond.priceProperties).eq(true);
  });

  it('Get next diamonds after last diamond (cursor pagination)', async () => {
    const headers = await getHeaders();

    const { diamond } = await createData();
    const { diamond: secondDiamond } = await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    const diamonds = await Diamond.find({});
    expect(diamonds.length).eq(2);

    const query = `?limit=1&lastRecordId=${secondDiamond._id}`;
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(1);
    const [reveivedDiamond] = data;

    expect(reveivedDiamond._id.toString()).eq(diamond._id.toString());
    expect(!!reveivedDiamond.priceProperties).eq(true);
  });

  it('Filter diamonds by type', async () => {
    const headers = await getHeaders();

    await createData();
    await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    // by Lab Grown
    const query = '?limit=50&type=lab grown';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(1);
    const [reveivedDiamond] = data;

    expect(reveivedDiamond.type).eq(DIAMOND_TYPES_ENUM.LabGrownDiamond);

    // by Natural Diamond
    const query2 = '?limit=50&type=natural diamond';
    const res2 = await request(app)
      .get('/diamonds' + query2)
      .set(headers);

    const { error: error2, data: data2 } = res2.body;
    expect(error2).eq(0);

    expect(data2.length).eq(1);
    const [reveivedDiamond2] = data2;

    expect(reveivedDiamond2.type).eq(DIAMOND_TYPES_ENUM.NaturalDiamond);
  });

  it('Filter diamonds by shape', async () => {
    const headers = await getHeaders();

    await createData();
    await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    // by oval
    const query = '?limit=50&shape=oval';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(1);
    const [reveivedDiamond] = data;

    expect(reveivedDiamond.characteristics.shape).eq('oval');

    // by round
    const query2 = '?limit=50&shape=round';
    const res2 = await request(app)
      .get('/diamonds' + query2)
      .set(headers);

    const { error: error2, data: data2 } = res2.body;
    expect(error2).eq(0);

    expect(data2.length).eq(1);
    const [reveivedDiamond2] = data2;

    expect(reveivedDiamond2.characteristics.shape).eq('round');
  });

  it('Filter diamonds by price', async () => {
    const headers = await getHeaders();

    const { price } = await createData();
    const { price: price2 } = await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    const query = '?limit=50&price=100,600';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(1);
    const [reveivedDiamond] = data;

    expect(reveivedDiamond.priceProperties.price).eq(price.price);

    const query2 = '?limit=50&price=700,1500';
    const res2 = await request(app)
      .get('/diamonds' + query2)
      .set(headers);

    const { error: error2, data: data2 } = res2.body;
    expect(error2).eq(0);

    expect(data2.length).eq(1);
    const [reveivedDiamond2] = data2;

    expect(reveivedDiamond2.priceProperties.price).eq(price2.price);
  });

  it('Filter diamonds by color', async () => {
    const headers = await getHeaders();

    const { diamond } = await createData();
    const { diamond: diamond2 } = await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    const query = '?limit=50&color=D,H';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(2);
    const [receivedDiamond2, reveivedDiamond] = data;

    expect(reveivedDiamond.characteristics.color).eq(diamond.characteristics.color);
    expect(receivedDiamond2.characteristics.color).eq(diamond2.characteristics.color);
  });

  it('Filter diamonds by fluorescence', async () => {
    const headers = await getHeaders();

    const { diamond } = await createData();
    const { diamond: diamond2 } = await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    const query = '?limit=50&fluorescence=very strong,none';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(2);
    const [receivedDiamond2, reveivedDiamond] = data;

    expect(reveivedDiamond.characteristics.fluorescence).eq(diamond.characteristics.fluorescence);
    expect(receivedDiamond2.characteristics.fluorescence).eq(diamond2.characteristics.fluorescence);
  });

  it('Filter diamonds by tablePercentage', async () => {
    const headers = await getHeaders();

    const { diamond } = await createData();
    const { diamond: diamond2 } = await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    const query = '?limit=50&tablePercentage=70,80';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(1);
    const [reveivedDiamond] = data;

    expect(reveivedDiamond.dimensions.tablePercentage).eq(diamond2.dimensions.tablePercentage);

    const query2 = '?limit=50&tablePercentage=50,60';
    const res2 = await request(app)
      .get('/diamonds' + query2)
      .set(headers);

    const { error: error2, data: data2 } = res2.body;
    expect(error2).eq(0);

    expect(data2.length).eq(1);
    const [reveivedDiamond2] = data2;

    expect(reveivedDiamond2.dimensions.tablePercentage).eq(diamond.dimensions.tablePercentage);
  });

  it('Filter diamonds by certLaboratory', async () => {
    const headers = await getHeaders();

    await createData();
    const { diamond } = await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    const query = '?limit=50&certLaboratory=AGS,IGI';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(2);
    const [reveivedDiamond] = data;

    expect(reveivedDiamond.certLaboratory).eq(diamond.certLaboratory);

    const query2 = '?limit=50&certLaboratory=IGI';
    const res2 = await request(app)
      .get('/diamonds' + query2)
      .set(headers);

    const { error: error2, data: data2 } = res2.body;
    expect(error2).eq(0);

    expect(data2.length).eq(1);
    const [reveivedDiamond2] = data2;

    expect(reveivedDiamond2.certLaboratory).eq('IGI');
  });

  it('Filter deleted diamonds', async () => {
    const headers = await getHeaders();

    await createData({ isDeleted: true });
    await createData(newDiamondProps as Partial<IPrice>, newPriceProps);

    const query = '?limit=50&certLaboratory=IGI';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(0);
  });

  it('No diamonds are found', async () => {
    const headers = await getHeaders();

    const query = '?limit=50&certLaboratory=IGI';
    const res = await request(app)
      .get('/diamonds' + query)
      .set(headers);

    const { error, data } = res.body;
    expect(error).eq(0);

    expect(data.length).eq(0);
  });
});
