import type { FastifyRequest, FastifyReply } from 'fastify';
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
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res() res: FastifyReply) {
    return res.status(HttpStatus.OK).send();
  }

  @UseGuards(CookieAuthGuard)
  @Post('logout')
  async logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    req.logOut();
    return res.status(HttpStatus.OK).send();
  }
}
