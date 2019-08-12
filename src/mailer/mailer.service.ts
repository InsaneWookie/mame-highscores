import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';
import { ConfigService } from "../config/config.service";
import * as Mail from "nodemailer/lib/mailer";

@Injectable()
export class MailerService {
  constructor(private readonly config: ConfigService){}

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
      console.log(text);
      transporter = nodemailer.createTransport({streamTransport: true, newline: 'unix', buffer: true});
    }

    return transporter.sendMail({
      from: 'Arcade Hiscores <no-reply@arcadehiscores.com>',
      to: to,
      subject: subject,
      text: text
    }).then((info) => {
      console.log(info.envelope);
      console.log(info.messageId);
      if(info.message){
        console.log(info.message.toString());
      }
    }).catch((err) => {
      console.error(err);
    });
  }
}
