
// import * as winston from 'winston';
import { Logger } from '@nestjs/common';

export class AppLogger extends Logger{
  constructor(
     private context2?: string,
     private isTimestampEnabled2 = false
  ) {
    super(context2, isTimestampEnabled2);
  }

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

  log(message: any, context?: string) {
    console.log(this.getLogStart(context, 'INFO'), message);
  }

  error(message: any, trace = '', context?: string) {
    console.error(this.getLogStart(context, 'ERROR'), message);
    console.error(trace);
  }

  warn(message: any, context?: string) {
    console.warn(this.getLogStart(context, 'WARN'), message);
  }

  debug(message: any, context?: string) {
    console.debug(this.getLogStart(context, 'DEBUG'), message);
  }

  verbose(message: any, context?: string) {
    console.log(this.getLogStart(context, 'VERBOSE'), message);
  }

  private getLogStart(context?: string, type?: string){
    const time = new Date().toISOString();
    return `${time} - ${type} - [${context || this.context2}] -`;
  }

}