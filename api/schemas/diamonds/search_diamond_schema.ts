import { Schema } from 'express-validator';
import { checkSchema } from 'express-validator';

const searchDiamondSchema: Schema = {
  reportNumber: {
    exists: {
      errorMessage: 'reportNumber is required',
      options: {
        checkFalsy: true
      }
    },
    isString: {
      errorMessage: 'reportNumber must be valid string'
    }
  }
};

export default checkSchema(searchDiamondSchema, ['query']);
