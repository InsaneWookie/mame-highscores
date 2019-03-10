import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { PassportModule } from '@nestjs/passport';
import { GroupService } from "./group.service";
import { Machine } from "../entity/machine.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from "../entity/group.entity";

describe('Group Controller', () => {
  let controller: GroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({defaultStrategy: 'jwt'}),],
      controllers: [GroupController],
      providers: [
        GroupService,
        {provide: getRepositoryToken(Group), useClass: Repository,}
      ]
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
