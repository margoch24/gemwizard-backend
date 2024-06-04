import { Schema } from 'express-validator';
import { checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';

const getDiamondSchema: Schema = {
  diamondId: {
    exists: {
      errorMessage: 'diamondId is required',
      options: {
        checkFalsy: true
      }
    },
    custom: {
      options: (id) => ObjectId.isValid(id as string),
      errorMessage: 'diamondId must be valid id'
    }
  }
};

export default checkSchema(getDiamondSchema, ['query']);
