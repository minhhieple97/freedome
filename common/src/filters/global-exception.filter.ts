import { LoggerService } from '@freedome/common';
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IAppConfig } from '../interfaces/app-config.interface';

@Catch()
export class GlobalExcetionFilter implements ExceptionFilter {
  private readonly logger = new LoggerService('GlobalExceptionFilter');
  constructor(private readonly appConfigService: IAppConfig) {}
  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const statusCode: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message: string =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';
    const isProduction = this.appConfigService.isProduction;
    if (isProduction) {
      this.logger.error(
        `error message => ${message}, trace => ${exception.stack}`,
      );

      response.status(statusCode).json({
        code: false,
        message,
        error: 'Internal server error',
      });
    } else {
      this.logger.error(
        `error message => ${message}, trace => ${exception.stack}`,
      );

      response.status(statusCode).json({
        code: false,
        message,
        error: message,
        error_trace: exception.stack,
      });
    }
  }
}
