import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { PassportModule } from '@nestjs/passport';

describe('Group Controller', () => {
  let controller: GroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({defaultStrategy: 'jwt'}),],
      controllers: [GroupController],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
