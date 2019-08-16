import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { User } from '../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtStrategy } from '../jwt.strategy';
import { UserGroup } from "../entity/usergroup.entity";
import { Repository } from "typeorm";
import { ConfigService } from "../config/config.service";
import { GroupService } from "../group/group.service";
import { MachineService } from "../machine/machine.service";
import { Group } from "../entity/group.entity";
import { Machine } from "../entity/machine.entity";
import { MailerService } from "../mailer/mailer.service";
import { AppLogger } from "../applogger.service";

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secretOrPrivateKey: 'test',
          signOptions: {
            expiresIn: 3600,
          },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),

      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        GroupService,
        MachineService,
        JwtStrategy,
        MailerService,
        AppLogger,
        {
          provide: ConfigService,
          useValue: new ConfigService(`${process.env.NODE_ENV || 'development'}.env`),
        },
        { provide: getRepositoryToken(User), useClass: Repository,},
        { provide: getRepositoryToken(Group), useClass: Repository,},
        { provide: getRepositoryToken(Machine), useClass: Repository,},
        { provide: getRepositoryToken(UserGroup), useClass: Repository,},
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
