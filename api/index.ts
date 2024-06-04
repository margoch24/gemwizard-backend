'use strict';
import express, { Application, NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as expresssRateLimit from 'express-rate-limit';
import { getDurationInMilliseconds } from './helpers/index';
import logger from './services/logger';
import path from 'path';

import DiamondRoutes from './routes/diamond_routes';
import PricingPlansRoutes from './routes/pricing_plans_routes';
import ReviewsRoutes from './routes/reviews_routes';
import ContactUsRoutes from './routes/contact_us_routes';

const app = express();
const rateLimit = expresssRateLimit.default;
dotenv.config();
app.use(cors({ origin: '*' }));
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(compression());

app.use(helmet());
app.set('view engine', 'ejs');
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1 request per second + 100 requests
    message: {
      success: false,
      data: [],
      error: {
        error: 'Too many requests, please try again later.'
      }
    }
  })
);

app.get('/ping', function (_: Request, res: Response) {
  return res.json('pong');
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') return next();
  const start = process.hrtime();

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);

    const strBody = JSON.stringify(req.body);
    let parsedBody;
    try {
      parsedBody = JSON.parse(strBody);
    } catch {
      parsedBody = {};
    }
    if (parsedBody.password) {
      parsedBody.password = '[covered]';
    }

    // const userId = req.current_user ? req.current_user._id : null;
    logger.info({
      method: req.method,
      url: req.url,
      // user_id: userId,
      body: JSON.stringify(parsedBody),
      headers: req.headers,
      ip: req.ip,
      status: res.statusCode,
      duration: durationInMilliseconds
    });
  });

  next();
});

app.use(
  '/images',
  (_, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Resource-Policy', '*');
    return next();
  },
  express.static(path.join(__dirname, '../upload'))
);

// VALIDATED HEADERS
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.token || req.headers.token !== process.env.APP_TOKEN) {
    return res.status(403).json({ error: 1, data: { message: 'Insufficient permissions' } });
  }

  return next();
});

app.use('/', [DiamondRoutes, PricingPlansRoutes, ReviewsRoutes, ContactUsRoutes]);

export default app as Application;
