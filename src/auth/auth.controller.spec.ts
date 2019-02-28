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

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secretOrPrivateKey: 'abc123',
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
        JwtStrategy,
        { provide: getRepositoryToken(User), useClass: Repository,},
        { provide: getRepositoryToken(UserGroup), useClass: Repository,},
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
