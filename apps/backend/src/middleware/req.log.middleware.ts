import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import logger from '../utils/logger';
import moment from 'moment';

@Injectable()
export class ReqLogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      logger.log(
        `[${moment().format('YYYY.MM.DD hh:mm:ss')}]\
        Method: ${req.method};\
        Url: ${req.url};\
        Query parameters: ${JSON.stringify(req.query)};\
        Body: ${JSON.stringify(req.body)};\
        Status code: ${res.statusCode}`.replace(/\s{2,}/g, ' '),
      );
    });
    next();
  }
}
