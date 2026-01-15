import { Controller, Get, Ip } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(@Ip() ip: string) {
    return {
      message: 'Hello',
      ip,
    };
  }
}
