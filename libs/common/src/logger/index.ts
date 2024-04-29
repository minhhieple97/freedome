import * as winston from 'winston';
import {
  ElasticsearchTransformer,
  ElasticsearchTransport,
  LogData,
  TransformedData,
} from 'winston-elasticsearch';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
};

export const winstonLogger = (name: string, level: string): winston.Logger => {
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport({
    level,
    transformer: esTransformer,
    clientOpts: {
      node: process.env.ELASTIC_SEARCH_URL,
      maxRetries: 2,
      requestTimeout: 10000,
      sniffOnStart: false,
    },
  });
  const options = {
    exitOnError: false,
    defaultMeta: { service: name },
    level,
    json: false,
    colorize: true,
    handleExceptions: true,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(name, {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
      esTransport,
    ],
  };

  const logger: winston.Logger = winston.createLogger(options);
  return logger;
};
