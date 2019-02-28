import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Game } from '../entity/game.entity';
import { Machine } from '../entity/machine.entity';
import { GamePlayed } from '../entity/gameplayed.entity';
import { User } from '../entity/user.entity';
import { Score } from '../entity/score.entity';
import { Group } from '../entity/group.entity';
import { UserGroup } from '../entity/usergroup.entity';
import { Alias } from '../entity/alias.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score, Group, UserGroup, Alias]),],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}
