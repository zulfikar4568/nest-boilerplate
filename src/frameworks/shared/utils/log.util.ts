import pino, { StreamEntry } from 'pino';
import { LokiOptions } from 'pino-loki/index';
import appConfig from '../../../config/app.config';

type LogPayload = string | Record<string, any>;

const stringifyArgs = (messages: LogPayload[]): string[] => {
  const stringifiedMessages = messages.map((message) =>
    stringifyMessage(message),
  );

  return stringifiedMessages;
};

const stringifyMessage = (message: LogPayload): string => {
  if (typeof message === 'object') {
    const formattedMessage = JSON.stringify(message, null, 2);
    return formattedMessage;
  }

  return message;
};

const logFnCommon = (
  message: LogPayload,
  args: LogPayload[],
  fn: pino.LogFn,
): string => {
  const formattedMessage = stringifyMessage(message);
  const formattedArgs = stringifyArgs(args);
  const mergedMessage = `${formattedMessage} ${formattedArgs.join(' ')}`;

  const finalMessage = mergedMessage.trim();

  fn(finalMessage);

  return finalMessage;
};

const logFnErr = (message: LogPayload, error: any, fn: pino.LogFn): string => {
  const formattedMessage = stringifyMessage(message);

  const finalMessage = formattedMessage.trim();

  fn(finalMessage);
  if (error) {
    fn(error);
  }

  return finalMessage;
};

const pinoPretty = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
    ignore: 'pid,hostname',
  },
});

const streams: StreamEntry[] = [{ level: 'debug', stream: pinoPretty }];

if (appConfig.LOKI_HOST) {
  const pinoLoki = pino.transport<LokiOptions>({
    target: 'pino-loki',
    options: {
      batching: false,
      labels: { application: appConfig.APP_NAME },
      host: appConfig.LOKI_HOST,
      basicAuth: {
        password: appConfig.LOKI_PASSWORD,
        username: appConfig.LOKI_USERNAME,
      },
    },
  });

  streams.push({ level: 'debug', stream: pinoLoki });
}

export const logger = pino({ level: 'trace' }, pino.multistream(streams));

export const log = {
  info: (message: LogPayload, ...args: LogPayload[]): void => {
    logFnCommon(message, args, logger.info.bind(logger));
  },
  warn: (message: LogPayload, ...args: LogPayload[]): void => {
    logFnCommon(message, args, logger.warn.bind(logger));
  },
  fatal: (message: LogPayload, error?: unknown): void => {
    logFnErr(message, error, logger.fatal.bind(logger));
  },
  error: (message: LogPayload, error?: unknown): void => {
    logFnErr(message, error, logger.error.bind(logger));
  },
  http: (message: LogPayload, ...args: LogPayload[]): void => {
    logFnCommon(message, args, logger.debug.bind(logger));
  },
  verbose: (message: LogPayload, ...args: LogPayload[]): void => {
    logFnCommon(message, args, logger.trace.bind(logger));
  },
  debug: (message: LogPayload, ...args: LogPayload[]): void => {
    logFnCommon(message, args, logger.debug.bind(logger));
  },
};

export interface ILog {
  info: (message: LogPayload, ...args: LogPayload[]) => void;
  warn: (message: LogPayload, ...args: LogPayload[]) => void;
  fatal: (message: LogPayload, error?: unknown) => void;
  error: (message: LogPayload, error?: unknown) => void;
  http: (message: LogPayload, ...args: LogPayload[]) => void;
  verbose: (message: LogPayload, ...args: LogPayload[]) => void;
  debug: (message: LogPayload, ...args: LogPayload[]) => void;
}

export default log;
