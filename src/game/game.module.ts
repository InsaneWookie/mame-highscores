import { Module } from '@nestjs/common';
import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { Game } from "../entity/game.entity";
import { Machine } from "../entity/machine.entity";
import { GamePlayed } from "../entity/gameplayed.entity";
import { User } from "../entity/user.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ScoredecoderService } from '../scoredecoder/scoredecoder.service';
import { Score } from '../entity/score.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score])],
  controllers: [GameController],
  providers: [GameService, ScoredecoderService],
  exports: [GameService]
})
export class GameModule {}
