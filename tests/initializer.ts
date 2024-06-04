import request from 'supertest';
import { expect, assert } from 'chai';
import { Diamond, Price, PricingPlan, Review, ContactUs } from '../api/models';
import app from '../api/index';
import mongoose, { ConnectOptions, ObjectId } from 'mongoose';
import path from 'path';
import { IDiamond } from '../api/models/diamonds';
import { IPrice } from '../api/models/prices';

process.env.NODE_ENV = 'test';

const { APP_TOKEN, MONGO_DB_NAME_TEST, FETCH_DIAMONDS_SECRET_KEY } = process.env;

beforeEach(async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_DB_NAME_TEST ?? '', {} as ConnectOptions);

  await mongoose.connection.db.dropDatabase();
});

const register = () => {
  const headers = {
    authorization: 'abc',
    token: APP_TOKEN
  };

  return headers;
};

const getHeaders = (params = {}) => {
  const headers = {
    token: APP_TOKEN as string
  };

  return headers;
};

const createData = async (diamondProps: Partial<IDiamond> = {}, priceProps: Partial<IPrice> = {}) => {
  const diamondParams = {
    certificateId: 'IGI ID LG591375120',
    diamondURL: 'https://www.stonealgo.com/diamond-details/igi-number-LG591375120',
    certLaboratory: 'IGI',
    certificateDate: 'Tue Jul 18 2023 03:00:00 GMT+0300 (Eastern European Summer Time)',
    type: 'lab grown',
    imageURL: 'https://stonealgo.b-cdn.net/img/img_e4f870895bf0862704956706833e4cae.jpg?width=900&height=900',
    affiliateLink:
      'https://www.whiteflash.com/loose-diamonds/1.3-carat-d-color-vs1-clarity-round-ideal-cut-lab-sku-260584?a_aid=SA2017',
    reportNumber: 'LG591375120',
    dimensions: {
      measurements: { length: 7.02, width: 7.04, depth: 4.26, unit: 'mm' },
      carat: 1.3,
      visualCarat: 1.32,
      tablePercentage: 0.58,
      depthPercentage: 0.606,
      culet: 'pointed',
      pavilionDepthPercentage: 0.43,
      pavilionAngle: 40.8,
      crownHeightPercentage: 0.135,
      crownAngle: 33,
      girdlePercentage: 0.04
    },
    characteristics: {
      shape: 'round',
      color: 'D',
      clarity: 'VS1',
      symmetry: 'excellent',
      polish: 'excellent',
      cutGrade: 'excellent',
      cutScore: 8.5,
      clarityCharacteristics: []
    },
    inscription: 'No inscription',
    comments: 'No comments',
    ...diamondProps
  };

  const diamond = await Diamond.create(diamondParams);

  const priceParams = {
    diamondId: diamond._id,
    date: '2024-02-23T21:09:30.128Z',
    price: 596,
    fairPrice: 653,
    priceDetails: 'Price Details',
    estimateRange: { min: 1183, max: 1552 },
    ...priceProps
  };

  const price = await Price.create(priceParams);

  return { diamond, price };
};

export {
  app,
  request,
  expect,
  register,
  getHeaders,
  APP_TOKEN,
  ObjectId,
  assert,
  path,
  Diamond,
  Price,
  PricingPlan,
  Review,
  FETCH_DIAMONDS_SECRET_KEY,
  ContactUs,
  createData
};
