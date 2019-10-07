import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { ConfigService } from "../config/config.service";
import { AppLogger } from "../applogger.service";

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService, ConfigService, AppLogger],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
