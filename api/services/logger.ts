import winston from 'winston';

const logFormat = winston.format.printf((info) => {
  const { method, url, user_id, body, status } = info.message as any;
  return `${method} ${url} ${status} ${user_id ? `userid:${user_id}` : ''} ${body}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston.format.json()),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat)
    }),
    new winston.transports.File({ filename: 'logs/requests.log' })
  ],
  exitOnError: false
});

export default logger;
