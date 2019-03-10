import { DynamicModule, Module } from '@nestjs/common';
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

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
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
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GroupService, MachineService, UserService, JwtStrategy],
})
export class AuthModule {

}
