import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 1, data: errors.array() });
  }

  return next();
};

export default validate;
