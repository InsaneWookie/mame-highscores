import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { Repository } from "typeorm";
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from "../entity/group.entity";

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        { provide: getRepositoryToken(Group), useClass: Repository},
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
