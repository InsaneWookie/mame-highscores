import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { join } from 'path';
declare const module: any;

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');

  // app.use(session({
  //   secret: 'a secret',
  //   name: 'abcd',
  //   resave: true,
  //   saveUninitialized: true,
  //   cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
  // }));

  // console.log(join(__dirname, '..', 'assets'));

  app.useStaticAssets(join(__dirname, '..', 'assets'));

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
