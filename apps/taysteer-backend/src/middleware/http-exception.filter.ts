import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import logger from '../utils/logger';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest();
    const res = context.getResponse();
    const next = context.getNext();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      status,
      timestamp: new Date().toLocaleDateString(),
      path: req.url,
      method: req.method,
      params: req.params,
      body: req.body,
      message: exception.message,
    };

    logger.error(JSON.stringify(errorResponse));

    res.status(status).send({ errorResponse });
    next();
  }
}
