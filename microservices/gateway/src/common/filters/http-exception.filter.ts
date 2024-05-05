import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Get the response object from the arguments host
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Get the request object from the arguments host
    const request = ctx.getRequest<Request>();

    // Get the status code from the exception
    const status = exception.getStatus();

    // Send a JSON response using the response object
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception.message ||
        exception.getResponse()['message'] ||
        'Internal Server Error',
    });
  }
}
