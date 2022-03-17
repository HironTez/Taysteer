import { LoginDataDto } from './typification/dto';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Controller, Get, Post, Req, Res, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ExtendedRequest } from './typification/interfaces';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { };

  // Main page
  @Get()
  main(): string {
    return this.appService.main();
  };

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: ExtendedRequest, @Res() res: Response, @Body() body: LoginDataDto) {
    const token = await this.authService.login(body);
    return token ? res.status(HttpStatus.OK).send({ token: token }) : res.status(HttpStatus.FORBIDDEN).send();
  };
};
