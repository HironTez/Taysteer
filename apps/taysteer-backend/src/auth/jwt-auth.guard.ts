import { Injectable, ExecutionContext, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_SECRET_KEY } from '../common/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // const res = context.switchToHttp().getResponse();
    // const req = context.switchToHttp().getRequest();

    // try {
    //   const token = req.headers.authorization?.replace('Bearer ', '');
    //   if (token) {
    //     if (jwt.verify(token, JWT_SECRET_KEY)) {
    //       return true;
    //     };
    //   };
    // } catch {
    //   res.status(HttpStatus.FORBIDDEN).send();
    //   return false;
    // };

    // res.status(HttpStatus.UNAUTHORIZED).send();
    // return false;
    return true
  };

  handleRequest(err: any, user: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    };
    return user;
  };
};