import { Controller, Get } from '@nestjs/common';


@Controller('main')
export class AppController {

  @Get()
  getAll(){
    return "Hello World!"
  }
}
