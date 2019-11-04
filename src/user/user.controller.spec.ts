import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { UserService } from "./user.service";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { UserGroup } from "../entity/usergroup.entity";
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from "../auth/auth.service";
import { GroupService } from "../group/group.service";
import { MachineService } from "../machine/machine.service";
import { JwtStrategy } from "../jwt.strategy";
import { ConfigService } from "../config/config.service";
import { Group } from "../entity/group.entity";
import { Machine } from "../entity/machine.entity";
import { JwtModule } from '@nestjs/jwt';
import { MailerService } from "../mailer/mailer.service";
import { AppLogger } from "../applogger.service";
import { Alias } from "../entity/alias.entity";
import { Score } from "../entity/score.entity";
import { Game } from "../entity/game.entity";

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test',
          signOptions: {
            expiresIn: 3600,
          },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UserController],
      providers: [
        UserService,
        AuthService,
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
        { provide: getRepositoryToken(Alias), useClass: Repository,},
        { provide: getRepositoryToken(Score), useClass: Repository,},
        { provide: getRepositoryToken(Game), useClass: Repository,},
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
