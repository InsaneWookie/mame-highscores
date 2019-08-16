import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppLogger } from "./applogger.service";
@Controller('main')
export class AppController {

  constructor() {}

  @Get()
  getAll(){
    // throw new Error('baddness');

    // let a = 0;
    //
    // let b :any = a/0;
    //
    // let l = new AppLogger('AppController');
    //
    // l.debug("debug test");

    return "Hello World!";
  }
}
