import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { AppLogger } from "../applogger.service";

@Module({
  providers: [MailerService, AppLogger],
  imports: [],
  exports: [MailerService]
})
export class MailerModule {}
