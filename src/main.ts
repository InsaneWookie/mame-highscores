import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { join } from 'path';
import { AppLogger } from "./applogger.service";
import { AllExceptionsFilter } from "./all-exception.filter";
declare const module: any;

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {logger: new AppLogger()});
  //(process.env.NODE_ENV==='production') ? {logger: new AppLogger()} : {logger: false}
  app.setGlobalPrefix('api/v1');
  app.useLogger(app.get(AppLogger));
  //app.useGlobalFilters(new AllExceptionsFilter(app.get(AppLogger)));

  // app.use(session({
  //   secret: 'a secret',
  //   name: 'abcd',
  //   resave: true,
  //   saveUninitialized: true,
  //   cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
  // }));

  app.useStaticAssets(join(__dirname, '..', 'assets'));

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  console.log(reason.stack);
  console.log(p);
  // application specific logging, throwing an error, or other logic here
});
//
// process.on('uncaughtException', (reason, p) => {
//   console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
//   console.log(reason.stack);
//   console.log(p);
//   // application specific logging, throwing an error, or other logic here
// });
bootstrap();
