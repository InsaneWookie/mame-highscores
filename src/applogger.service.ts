// import {LoggerService} from '@nestjs/common';
// import * as winston from 'winston';
import { Logger } from '@nestjs/common';

export class AppLogger extends Logger{
  // private logger;
  //
  // constructor(){
  //   super();
  // }
  //constructor() {
    // this.logger = new winston.Logger({
    //   transports: [
    //     new winston.transports.Console({
    //       label: 'Help me Im blond',
    //       timestamp: () => DateTime.local().toString(),
    //       formatter: options => `${options.timestamp()} [${options.level.toUpperCase()}] ${options.label} - ${options.message}`
    //     })
    //   ]
    // });
  //}

  // error(message: any, trace = '', context?: string) {
  //   const time = new Date().toISOString();
  //   console.error(`${time} - ERROR - [${context}] - ${message}`);
  // }

  log(message: any, context?: string) {
    const time = new Date().toISOString();
    console.log(`${time} - INFO - [${context}] - ${message}`);
    // AppLogger.log(message, context);
  }

  // static log(message: any, context?: string) {
  //   const time = new Date().toISOString();
  //   console.log(`${time} - INFO - [${context}] - ${message}`);
  // }
  //
  // warn(message: any, context?: string) {
  //   this.callFunction('warn', message, context);
  // }
  //
  // debug(message: any, context?: string) {
  //   this.callFunction('debug', message, context);
  // }
  //
  // verbose(message: any, context?: string) {
  //   this.callFunction('verbose', message, context);
  // }

}