import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { Game } from '../entity/game.entity';
import { Machine } from '../entity/machine.entity';
import { GamePlayed } from '../entity/gameplayed.entity';
import { User } from '../entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Score } from "../entity/score.entity";
import { Group } from "../entity/group.entity";
import { UserGroup } from "../entity/usergroup.entity";
import { Alias } from "../entity/alias.entity";
import { GameService } from "./game.service";
import { Repository } from "typeorm";
import { ScoredecoderService } from "../scoredecoder/scoredecoder.service";

describe('Game Controller', () => {
  let controller: GameController;

  beforeEach(async () => {
    // const mockRepository =

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
      ],
      controllers: [GameController],
      providers: [
        GameService,
        ScoredecoderService,
        //{ provide: getRepositoryToken(Game), useValue: mockRepository,}
        { provide: getRepositoryToken(Game), useClass: Repository,},
        { provide: getRepositoryToken(GamePlayed), useClass: Repository,},
        { provide: getRepositoryToken(Score), useClass: Repository,},
        { provide: getRepositoryToken(User), useClass: Repository,},
        { provide: getRepositoryToken(Machine), useClass: Repository,}
        ]
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
