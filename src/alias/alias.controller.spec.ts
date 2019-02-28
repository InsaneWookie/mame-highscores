import { Test, TestingModule } from '@nestjs/testing';
import { AliasController } from './alias.controller';

describe.skip('Alias Controller', () => {
  let controller: AliasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliasController],
    }).compile();

    controller = module.get<AliasController>(AliasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
