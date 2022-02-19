import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

class LoginDataDto {
  readonly login!: string;
  readonly password!: string;
};

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

  @Post('login')
  async login(@Res() res: Response, @Body() body: LoginDataDto) {
    const token = await this.authService.login(body);
    return token ? res.status(HttpStatus.OK).send({ token: token }) : res.status(HttpStatus.FORBIDDEN).send();
  };
};