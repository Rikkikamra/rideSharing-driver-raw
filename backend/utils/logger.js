// backend/utils/logger.js
const Sentry = require('@sentry/node');
const { createLogger, format, transports } = require('winston');

// Initialize Sentry APM
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'feedback-service' },
  transports: [
    new transports.Console(),  // always log to console
    new transports.File({ filename: 'logs/feedback-error.log', level: 'error' }),
    new transports.File({ filename: 'logs/feedback-combined.log' })
  ],
});

module.exports = { logger, Sentry };
