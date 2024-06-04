#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict';
import app from './index';
import mongoose from 'mongoose';
import pm2 from 'pm2';
import axios from 'axios';

const { PORT, NODE_ENV, MONGO_DB_NAME_TEST, MONGO_DB_NAME_DEV } = process.env;

const port = PORT || 3000;

const dbName: string | undefined = NODE_ENV === 'test' ? MONGO_DB_NAME_TEST : MONGO_DB_NAME_DEV;

mongoose.set('strictQuery', true);
mongoose.connect(dbName || '', {} as mongoose.ConnectOptions);

app
  .listen(port, () => {
    console.log(`Server started on port ${port}`);
  })
  .on('error', (err: Error) => {
    console.log('ERROR: ', err);
  });

pm2.launchBus((err: Error, bus: any) => {
  if (err) {
    console.error('PM2 launchBus error: ', err);
  }
  bus.on('log:err', async (e: any) => {
    const regex = /unauthorizederror.*jwt|jwt.*unauthorizederror/i;
    if (e.data.match(regex)) {
      return;
    }

    await axios
      .post(process.env.SLACK_WEBHOOK ?? '', {
        attachments: [
          {
            fallback: 'Error message.',
            color: '#FF0000',
            title: `PM2 process "${e.process.name}" - ID ${e.process.pm_id}`,
            text: e.data,
            ts: e.at
          }
        ]
      })
      .catch((err: Error) => console.error('Slack post message error: ', err));
  });
});
