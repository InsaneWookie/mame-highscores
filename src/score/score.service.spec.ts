import { Test, TestingModule } from '@nestjs/testing';
import { ScoreService } from './score.service';

describe.skip('ScoreService', () => {
  let service: ScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoreService],
    }).compile();

    service = module.get<ScoreService>(ScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
