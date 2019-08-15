import { Controller, Get } from '@nestjs/common';
@Controller('main')
export class AppController {

  constructor() {}

  @Get()
  getAll(){
    return ""
  }
}
