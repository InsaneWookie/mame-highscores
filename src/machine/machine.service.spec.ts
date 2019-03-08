import { Test, TestingModule } from '@nestjs/testing';
import { MachineService } from './machine.service';
import { Repository } from "typeorm";
import { getRepositoryToken } from '@nestjs/typeorm';
import { Machine } from "../entity/machine.entity";
import { Group } from "../entity/group.entity";

describe('MachineService', () => {
  let service: MachineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachineService,
        {provide: getRepositoryToken(Machine), useClass: Repository,},
        {provide: getRepositoryToken(Group), useClass: Repository,},],
    }).compile();

    service = module.get<MachineService>(MachineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
