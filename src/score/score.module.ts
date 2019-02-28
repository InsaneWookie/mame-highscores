import { Module } from '@nestjs/common';
import { Game } from "../entity/game.entity";
import { Machine } from "../entity/machine.entity";
import { GamePlayed } from "../entity/gameplayed.entity";
import { User } from "../entity/user.entity";
import { Score } from "../entity/score.entity";
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreService } from "./score.service";
import { ScoreController } from "./score.controller";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score])],
  providers: [ScoreService],
  controllers: [ScoreController],
})
export class ScoreModule {}
