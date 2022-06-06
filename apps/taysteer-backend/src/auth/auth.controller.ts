import { FastifyRequest } from 'fastify';
import { CookieAuthGuard } from './guards/cookie-auth.guard';
import {
  Controller,
  Post,
  Res,
  HttpStatus,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res() res: Response) {
    return res.status(HttpStatus.OK).send();
  }

  @UseGuards(CookieAuthGuard)
  @Post('logout')
  async logout(@Req() req: FastifyRequest, @Res() res: Response) {
    req.logOut();
    return res.status(HttpStatus.OK).send();
  }
}
