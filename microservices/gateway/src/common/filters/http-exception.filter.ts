import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { Metadata, status } from '@grpc/grpc-js';
import { ErrorStatusMapper } from '../helpers/error-status-mapper.helper';

interface CustomException<T> {
  code: status;
  details: T;
  metadata: Metadata;
}

@Catch(RpcException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const err = exception.getError();
    let _exception: CustomException<string>;

    if (typeof err === 'object') {
      _exception = err as CustomException<string>;
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const mapper = new ErrorStatusMapper();
    const status = mapper.grpcToHttpMapper(_exception.code);
    const type = HttpStatus[status];
    const message = exception.message;
    response.status(status).json({
      statusCode: status,
      message,
      error: type,
    });
  }
}
