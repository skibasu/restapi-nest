import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionsRes = exception.getResponse() as {
      [k: string]: string | number | string[];
    };
    const status = exception.getStatus();
    const message = exceptionsRes.message || exception.message;
    const error = exception.name;

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
