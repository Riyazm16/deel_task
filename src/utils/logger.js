const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const logDir = path.join(__dirname, '../../appLogs');
console.log('logdir::', logDir);
const jsonLogFileFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.splat(),

);
const isLogSilent = process.env.LOG_SILENCE === 1;

console.log('is Log silenced::', isLogSilent);
exports.logger = winston.createLogger({
  level: 'info',
  format: jsonLogFileFormat,
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'contracts-error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      level: 'error',
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'contracts-combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      silent: isLogSilent,
    }),
    new winston.transports.Console({
      colorize: true,
      silent: isLogSilent,
    }),
  ],
});