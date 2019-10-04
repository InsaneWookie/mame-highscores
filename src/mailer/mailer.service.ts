import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';
import { ConfigService } from "../config/config.service";
import * as Mail from "nodemailer/lib/mailer";
import { AppLogger } from "../applogger.service";


@Injectable()
export class MailerService {
  constructor(private readonly config: ConfigService,
              private readonly l: AppLogger){}

  sendMail(to :string, subject: string, text: string ) {

    AWS.config.update({
      region: 'us-west-2',
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY')
    });

    let aws = new AWS.SES({ apiVersion: "2010-12-01" });

    //TODO: inject the transport mailer
    let transporter : Mail = null;
    if(process.env.NODE_ENV === 'production'){
      transporter = nodemailer.createTransport({SES: aws});
    } else {
      this.l.log(text,  'MailerService');
      transporter = nodemailer.createTransport({streamTransport: true, newline: 'unix', buffer: true});
    }

    return transporter.sendMail({
      from: 'Arcade Hiscores <no-reply@arcadehiscores.com>',
      to: to,
      subject: subject,
      text: text
    }).then((info) => {
      this.l.log(info.envelope, 'MailerService');
      this.l.log(info.messageId, 'MailerService');
      if(info.message){
        this.l.log(info.message.toString(),  'MailerService');
      }
    }).catch((err) => {
      this.l.error(err,  'MailerService');
    });
  }
}
