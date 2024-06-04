import { Schema } from 'express-validator';
import { checkSchema } from 'express-validator';

const postContactUsSchema: Schema = {
  name: {
    isString: {
      errorMessage: 'name must be a valid string'
    }
  },
  email: {
    isString: {
      errorMessage: 'email must be a valid string'
    }
  },
  phoneNumber: {
    isString: {
      errorMessage: 'phoneNumber must be a valid string'
    }
  },
  message: {
    isString: {
      errorMessage: 'message must be a valid string'
    }
  }
};

export default checkSchema(postContactUsSchema, ['body']);
