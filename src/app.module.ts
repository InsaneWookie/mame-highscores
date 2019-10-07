import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePlayed } from './entity/gameplayed.entity';
import { Machine } from './entity/machine.entity';
import { Game } from './entity/game.entity';
import { User } from './entity/user.entity';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { Score } from './entity/score.entity';
import { Group } from './entity/group.entity';
import { UserGroup } from './entity/usergroup.entity';
import { Alias } from './entity/alias.entity';
import { AliasModule } from './alias/alias.module';
import { ScoreModule } from './score/score.module';
import { ConfigModule } from './config/config.module';
import { getMetadataArgsStorage } from "typeorm";
import { AppController } from "./app.controller";
import { MachineModule } from './machine/machine.module';
import { MailerModule } from './mailer/mailer.module';
import { MailerService } from "./mailer/mailer.service";
import { AppLogger } from "./applogger.service";
import { LoggerModule } from "./logger.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "./config/config.service";

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        // console.log(config);
        return ({
          secretOrPrivateKey: config.get('JWT_KEY'),
          signOptions: { expiresIn: parseInt(config.get('JWT_EXPIRES_IN')) },
        })},
      inject: [ConfigService]
    }),

    ConfigModule,
    TypeOrmModule.forRoot({
      "keepConnectionAlive": true,
      "type": "postgres",
      "host": "192.168.99.100",
      "port": 5432,
      "username": "postgres",
      "password": "example",
      "database": "mame-highscores",
      "entities": getMetadataArgsStorage().tables.map(tbl => tbl.target),
      //"migrations": ["src/migration/*{.ts,.js}"],
      "synchronize": false,
      //"logging": true
      // "cli": {
      //   "entitiesDir": "src",
      //   "migrationsDir": "src/migration"
      // }
    }),
    TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score, Group, UserGroup, Alias]),

    LoggerModule,

    //modules needed to enable controllers
    AuthModule,
    GameModule,
    UserModule,
    GroupModule,
    AliasModule,
    ScoreModule,
    MachineModule,

  ],
  controllers: [AppController],
  providers: [],
  exports: []
})
export class AppModule {
  constructor(private readonly logger: AppLogger) {
    // console.log(process.env);
    logger.log(`NODE_ENV=${process.env.NODE_ENV}`, 'AppModule');
  }
}
