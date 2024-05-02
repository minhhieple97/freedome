import { LoggerService as LS } from '@nestjs/common';
import * as winston from 'winston';
const { combine, timestamp } = winston.format;
import {
  ElasticsearchTransformer,
  ElasticsearchTransport,
  LogData,
  TransformedData,
} from 'winston-elasticsearch';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

export class LoggerService implements LS {
  private logger: LS;

  constructor(private readonly serviceName: string) {
    this.logger = WinstonModule.createLogger({
      transports: this.logTransports(),
    });
  }

  log(message: any, fields?: any) {
    this.logger.log(this.toPrettyJson(message, fields));
  }
  error(message: any, fields?: any) {
    this.logger.error(this.toPrettyJson(message, fields));
  }
  warn(message: any, fields?: any) {
    this.logger.warn(this.toPrettyJson(message, fields));
  }
  debug(message: any, fields?: any) {
    this.logger.debug(this.toPrettyJson(message, fields));
  }
  verbose(message: any, fields?: any) {
    this.logger.verbose(this.toPrettyJson(message, fields));
  }

  private toPrettyJson(message: any, fields?: any) {
    const log = {};
    if (typeof message === 'string') {
      log['message'] = message;
    } else if (typeof message === 'object') {
      for (const [key, value] of Object.entries(message)) {
        log[key] = value;
      }
    }
    if (fields) {
      if (typeof fields === 'object') {
        for (const [key, value] of Object.entries(fields)) {
          log[key] = value;
        }
      } else if (typeof fields === 'string') {
        log['context'] = fields;
      }
    }
    return log;
  }

  private logTransports = () => {
    const esTransformer = (logData: LogData): TransformedData => {
      return ElasticsearchTransformer(logData);
    };
    const esTransport: ElasticsearchTransport = new ElasticsearchTransport({
      level: 'debug',
      transformer: esTransformer,
      clientOpts: {
        node: process.env.ELASTIC_SEARCH_URL,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false,
      },
    });
    const format = combine(
      timestamp(),
      nestWinstonModuleUtilities.format.nestLike(this.serviceName, {
        colors: true,
        prettyPrint: true,
      }),
    );

    const logTransports = [
      new winston.transports.Console({
        format: format,
      }),
      esTransport,
    ];

    return logTransports;
  };
}
