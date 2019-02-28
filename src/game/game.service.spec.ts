import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Game } from '../entity/game.entity';
import { Machine } from '../entity/machine.entity';
import { GamePlayed } from '../entity/gameplayed.entity';
import { User } from '../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScoredecoderService } from "../scoredecoder/scoredecoder.service";
import { Repository } from "typeorm";
import { Score } from "../entity/score.entity";

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
         GameService,
        { provide: getRepositoryToken(Game), useClass: Repository,},
        { provide: getRepositoryToken(GamePlayed), useClass: Repository,},
        { provide: getRepositoryToken(Score), useClass: Repository,},
        { provide: getRepositoryToken(User), useClass: Repository,},
        { provide: getRepositoryToken(Machine), useClass: Repository,},
        ScoredecoderService
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
