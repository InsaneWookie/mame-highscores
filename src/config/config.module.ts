import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(process.env.NODE_ENV != undefined ? process.env.NODE_ENV.trim() + '.env' : 'development.env'),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}