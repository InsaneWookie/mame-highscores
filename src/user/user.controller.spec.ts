import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { UserService } from "./user.service";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { UserGroup } from "../entity/usergroup.entity";
import { getRepositoryToken } from '@nestjs/typeorm';

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UserController],
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useClass: Repository,},
        { provide: getRepositoryToken(UserGroup), useClass: Repository,},
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
