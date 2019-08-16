import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../entity/game.entity';
import { Machine } from '../entity/machine.entity';
import { GamePlayed } from '../entity/gameplayed.entity';
import { Group } from '../entity/group.entity';
import { Score } from '../entity/score.entity';
import { UserGroup } from '../entity/usergroup.entity';
import { Alias } from '../entity/alias.entity';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";
import { GroupService } from "../group/group.service";
import { MachineService } from "../machine/machine.service";
import { JwtStrategy } from "../jwt.strategy";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { JwtModule } from '@nestjs/jwt';
import { MailerService } from "../mailer/mailer.service";
import { LoggerModule } from "../logger.module";
import { AppLogger } from "../applogger.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score, Group, UserGroup, Alias]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        // console.log(config);
        return ({
          secretOrPrivateKey: config.get('JWT_KEY'),
          signOptions: { expiresIn: parseInt(config.get('JWT_EXPIRES_IN')) },
        })},
      inject: [ConfigService]
    }),
  ],
  providers: [UserService, AuthService, GroupService, MachineService, UserService, JwtStrategy, MailerService, AppLogger],
  controllers: [UserController],
})
export class UserModule {
}
