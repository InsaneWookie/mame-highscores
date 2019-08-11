import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePlayed } from './entity/gameplayed.entity';
import { Machine } from './entity/machine.entity';
import { Game } from './entity/game.entity';
import { User } from './entity/user.entity';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ScoredecoderService } from './scoredecoder/scoredecoder.service';
import { GroupModule } from './group/group.module';
import { Score } from './entity/score.entity';
import { Group } from './entity/group.entity';
import { UserGroup } from './entity/usergroup.entity';
import { Alias } from './entity/alias.entity';
import { AliasController } from './alias/alias.controller';
import { AliasModule } from './alias/alias.module';
import { ScoreController } from './score/score.controller';
import { ScoreService } from './score/score.service';
import { ScoreModule } from './score/score.module';
import { ConfigModule } from './config/config.module';
import { getConnectionOptions, getMetadataArgsStorage } from "typeorm";
import { AppController } from "./app.controller";
import { MachineModule } from './machine/machine.module';
import { MailerModule } from './mailer/mailer.module';
import { MailerService } from "./mailer/mailer.service";
import * as path from "path";



@Module({
  imports: [
    TypeOrmModule.forRoot({
      "keepConnectionAlive": true,
      "type": "postgres",
      "host": "db",
      "port": 5432,
      "username": "postgres",
      "password": "example",
      "database": "mame-highscores",
      "entities": getMetadataArgsStorage().tables.map(tbl => tbl.target),
      //"migrations": ["src/migration/*{.ts,.js}"],
      "synchronize": false,
      // "cli": {
      //   "entitiesDir": "src",
      //   "migrationsDir": "src/migration"
      // }
    }),
    TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score, Group, UserGroup, Alias]),
    AuthModule,
    GameModule,
    UserModule,
    GroupModule,
    AliasModule,
    ScoreModule,
    ConfigModule,
    MachineModule,
    MailerModule
  ],
  controllers: [AppController],
  providers: [MailerService],
})
export class AppModule {
  constructor() {
    console.log(process.env.NODE_ENV)
  }
}
