import { Test, TestingModule } from '@nestjs/testing';
import { MachineController } from './machine.controller';
import { PassportModule } from '@nestjs/passport';
import { MachineService } from "./machine.service";
import { Machine } from "../entity/machine.entity";
import { Repository } from "typeorm";
import { Group } from "../entity/group.entity";
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Machine Controller', () => {
  let controller: MachineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({defaultStrategy: 'jwt'}),],
      providers: [MachineService,
        {provide: getRepositoryToken(Machine), useClass: Repository,},
        {provide: getRepositoryToken(Group), useClass: Repository,},],
      controllers: [MachineController],
    }).compile();

    controller = module.get<MachineController>(MachineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
