import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import logger from '../utils/logger';
import moment from 'moment';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest();
    const res = context.getResponse();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      status,
      timestamp: moment().format('YYYY.MM.DD hh:mm:ss'),
      path: req.url,
      method: req.method,
      params: req.params,
      body: req.body,
      message: exception.message,
    };

    // Save log
    if (!isHttpException) logger.error(JSON.stringify(errorResponse));

    // Send response
    res.status(status).send({
      errorResponse: isHttpException
        ? errorResponse
        : { ...errorResponse, message: 'Internal Server Error' },
    });
  }
}
