import { Module } from '@nestjs/common';
import { AliasService } from './alias.service';
import { PassportModule } from '@nestjs/passport';
import { AliasController } from "./alias.controller";
import { Game } from "../entity/game.entity";
import { Machine } from "../entity/machine.entity";
import { GamePlayed } from "../entity/gameplayed.entity";
import { User } from "../entity/user.entity";
import { Score } from "../entity/score.entity";
import { Group } from "../entity/group.entity";
import { UserGroup } from "../entity/usergroup.entity";
import { Alias } from "../entity/alias.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameService } from "../game/game.service";
import { ScoredecoderService } from "../scoredecoder/scoredecoder.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score, Group, UserGroup, Alias]),
    PassportModule.register({defaultStrategy: 'jwt'})],
  providers: [AliasService, GameService, ScoredecoderService],
  controllers: [AliasController]
})
export class AliasModule {}
