import { LoggerService } from '@freedome/common';
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExcetionFilter implements ExceptionFilter {
  private readonly logger = new LoggerService('GlobalExceptionFilter');
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

    this.logger.error(
      `error message => ${message}, trace => ${exception.stack}`,
    );

    response.status(statusCode).json({
      code: false,
      message: 'Oops! Something went wrong. Please try again',
      error: message,
      error_trace: exception.stack,
    });
  }
}
