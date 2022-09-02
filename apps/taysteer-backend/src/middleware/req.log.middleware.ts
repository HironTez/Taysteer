import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { getTime } from '../utils/current.time';

@Injectable()
export class ReqLogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      logger.log(
        `[${getTime()}]\
        Method: ${req.method};\
        Url: ${req.url};\
        Query parameters: ${JSON.stringify(req.query)};\
        Body: ${JSON.stringify(req.body)};\
        Status code: ${res.statusCode}`.replace(/\s{2,}/g, ' ')
      );
    });
    next();
  }
}
