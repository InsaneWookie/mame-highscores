import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../jwt.strategy';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { GroupService } from "../group/group.service";
import { MachineService } from "../machine/machine.service";
import { Game } from "../entity/game.entity";
import { Machine } from "../entity/machine.entity";
import { GamePlayed } from "../entity/gameplayed.entity";
import { User } from "../entity/user.entity";
import { Score } from "../entity/score.entity";
import { Group } from "../entity/group.entity";
import { UserGroup } from "../entity/usergroup.entity";
import { Alias } from "../entity/alias.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerService } from "../mailer/mailer.service";
import { LoggerModule } from "../logger.module";
import { AppLogger } from "../applogger.service";
import { AliasService } from 'src/alias/alias.service';
import { GameService } from 'src/game/game.service';
import { ScoreService } from 'src/score/score.service';
import { ScoredecoderService } from 'src/scoredecoder/scoredecoder.service';
import { GroupModule } from "../group/group.module";
import { MachineModule } from "../machine/machine.module";
import { MailerModule } from "../mailer/mailer.module";

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        // console.log(config);
        return ({
          secret: config.get('JWT_KEY'),
          signOptions: { expiresIn: parseInt(config.get('JWT_EXPIRES_IN')) },
      })},
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score, Group, UserGroup, Alias]),

    UserModule,
    GroupModule,
    MachineModule,
    MailerModule

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
  // providers: [AuthService, UserService, GroupService, AliasService, GameService, ScoreService,
  //    MachineService, JwtStrategy, ConfigService, MailerService, AppLogger, ScoredecoderService],
})
export class AuthModule {

}
