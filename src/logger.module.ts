import { Global, Module } from '@nestjs/common';
import { AppLogger } from "./applogger.service";

@Global()
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}