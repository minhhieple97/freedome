import { AppConfigService } from '@auth/config/app/config.service';
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
  constructor(private readonly appConfigService: AppConfigService) {}
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

// import { AppConfigService } from '@auth/config/app/config.service';
// import { LoggerService } from '@freedome/common';
// import {
//   ArgumentsHost,
//   ExceptionFilter,
//   HttpException,
//   Catch,
//   HttpStatus,
//   RpcExceptionFilter,
// } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';
// import { Response } from 'express';
// import { throwError } from 'rxjs';
// export function sendSuccess<T>(
//   data: T,
//   message = 'Success',
//   statusCode: number = HttpStatus.OK,
// ): ApiResponse<T> {
//   return {
//     status: 'success',
//     statusCode,
//     message,
//     data,
//   };
// }

// export function sendError<T>(
//   message: string,
//   statusCode: number,
// ): ApiResponse<T> {
//   return {
//     status: 'error',
//     statusCode,
//     message,
//     data: null,
//   };
// }

// export interface ApiResponse<T> {
//   status: 'success' | 'error';
//   statusCode: number;
//   message: string;
//   data: T | null;
// }

// @Catch(RpcException)
// export class GlobalExcetionFilter implements RpcExceptionFilter<RpcException> {
//   catch(exception: Error, host: ArgumentsHost): any {
//     const ctx = host.switchToHttp();
//     const response: Response = ctx.getResponse();
//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;
//     const message =
//       exception instanceof HttpException
//         ? exception.message
//         : 'Internal Server Error';
//     console.log({ status, message });
//     return throwError(() =>
//       response.status(status).json(sendError(message, status)),
//     );
//   }
// }
