import { Controller, Get } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AuthService } from "./auth/auth.service";
import { MailerService } from "./mailer/mailer.service";

@Controller('main')
export class AppController {

  constructor(private readonly mailer: MailerService) {
  }

  @Get()
  getAll(){
    return "Hello World!"
  }

  @Get('nodemailer')
  emailTestNodeMailer(){
    // this.mailer.sendMailConsole(null);
  }

  @Get('emailtest')
  emailTest(){
    this.mailer.sendMail("rowan.tate@gmail.com", "Test email", "bob man");
    return "bob";
  }
}
