import { Schema } from 'express-validator';
import { checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';

const getDiamondsSchema: Schema = {
  limit: {
    exists: {
      errorMessage: 'limit is required',
      options: {
        checkFalsy: true
      }
    }
  },
  lastRecordId: {
    optional: {
      options: { nullable: true }
    },
    custom: {
      options: (id) => ObjectId.isValid(id as string),
      errorMessage: 'lastRecordId must be valid id'
    }
  },
  type: {
    optional: {
      options: { nullable: true }
    }
  },
  shape: {
    optional: {
      options: { nullable: true }
    }
  },
  price: {
    optional: {
      options: { nullable: true }
    }
  },
  carat: {
    optional: {
      options: { nullable: true }
    }
  },
  color: {
    optional: {
      options: { nullable: true }
    }
  },
  clarity: {
    optional: {
      options: { nullable: true }
    }
  },
  symmetry: {
    optional: {
      options: { nullable: true }
    }
  },
  polish: {
    optional: {
      options: { nullable: true }
    }
  },
  fluorescence: {
    optional: {
      options: { nullable: true }
    }
  },
  cutGrade: {
    optional: {
      options: { nullable: true }
    }
  },
  tablePercentage: {
    optional: {
      options: { nullable: true }
    }
  },
  depthPercentage: {
    optional: {
      options: { nullable: true }
    }
  },
  lengthWidthRatio: {
    optional: {
      options: { nullable: true }
    }
  },
  count: {
    optional: {
      options: { nullable: true }
    }
  }
};

export default checkSchema(getDiamondsSchema, ['query']);
