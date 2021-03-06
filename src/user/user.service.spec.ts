import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserGroup } from '../entity/usergroup.entity';
import { Repository } from "typeorm";
import { AppLogger } from "../applogger.service";
import { Alias } from "../entity/alias.entity";
import { Score } from "../entity/score.entity";

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AppLogger,
        { provide: getRepositoryToken(User), useClass: Repository,},
        { provide: getRepositoryToken(UserGroup), useClass: Repository,},
        { provide: getRepositoryToken(Alias), useClass: Repository,},
        { provide: getRepositoryToken(Score), useClass: Repository,},
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
