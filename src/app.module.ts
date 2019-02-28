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
import { getConnectionOptions } from "typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score, Group, UserGroup, Alias]),
    AuthModule,
    GameModule,
    UserModule,
    GroupModule,
    AliasModule,
    ScoreModule,
    ConfigModule
  ],
  controllers: [ScoreController],
  providers: [ScoredecoderService, ScoreService],
})
export class AppModule {
  constructor() {
    console.log(process.env.NODE_ENV)
  }
}
