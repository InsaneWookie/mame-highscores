import { forwardRef, Module } from '@nestjs/common';
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

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score, Group, UserGroup, Alias]),

    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => {
    //     // console.log(config);
    //     return ({
    //       secretOrPrivateKey: config.get('JWT_KEY'),
    //       signOptions: { expiresIn: parseInt(config.get('JWT_EXPIRES_IN')) },
    //     })},
    //   inject: [ConfigService]
    // }),

    // AuthModule,
    // ModuleRef
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {
}
