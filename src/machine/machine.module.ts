import { Module } from '@nestjs/common';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { Game } from "../entity/game.entity";
import { Machine } from "../entity/machine.entity";
import { GamePlayed } from "../entity/gameplayed.entity";
import { User } from "../entity/user.entity";
import { Score } from "../entity/score.entity";
import { Group } from "../entity/group.entity";
import { UserGroup } from "../entity/usergroup.entity";
import { Alias } from "../entity/alias.entity";
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Machine, Group])],
  controllers: [MachineController],
  providers: [MachineService],
  exports: [MachineService]
})
export class MachineModule {}
