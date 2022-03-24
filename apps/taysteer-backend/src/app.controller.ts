import { Controller, Get, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { };

  // Main page
  @Get()
  main(): string {
    return this.appService.main();
  };
};
