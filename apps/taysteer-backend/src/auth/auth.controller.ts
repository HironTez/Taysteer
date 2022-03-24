import { FastifyRequest } from 'fastify';
import { CookieAuthGuard } from './guards/cookie-auth.guard';
import { Controller, Post, Res, Body, HttpStatus, UseGuards, ClassSerializerInterceptor, UseInterceptors, Req } from '@nestjs/common';
import { Response } from 'express';
import { LoginDataDto } from '../typification/dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { };

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res() res: Response, @Body() body: LoginDataDto) {
    const token = await this.authService.login(body);
    return token ? res.status(HttpStatus.OK).send() : res.status(HttpStatus.FORBIDDEN).send();
  };

  @UseGuards(CookieAuthGuard)
  @Post('logout')
  async logout(@Req() req: FastifyRequest, @Res() res: Response) {
    req.logOut();
    return res.status(HttpStatus.OK).send();
  }
};
