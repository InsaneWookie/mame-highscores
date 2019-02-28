import { Injectable } from '@nestjs/common';
import { Score } from "../entity/score.entity";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "../entity/user.entity";

@Injectable()
export class ScoreService {
  constructor(@InjectRepository(Score) private readonly scoreRepo: Repository<Score>){}

  async findAll(groupId: number, gameId?: number): Promise<Score[]> {

    let query = this.scoreRepo.createQueryBuilder('score')
      .leftJoin('score.alias', 'alias', 'score.alias_id = alias.id')
      .leftJoin('alias.userGroup', 'ug', 'alias.user_group_id = ug.id')
      .leftJoinAndMapOne('score.user', User, 'user', 'ug.user_id = user.id')
      .innerJoin('machine', 'm', 'score.machine_id = m.id')
      .where('m.group_id = :groupId', {groupId: groupId});

    if(gameId){
      query.andWhere('score.game_id = :gameId', {gameId});
    }

    return await query
      .orderBy('score.rank', "ASC")
      .getMany();
  }
}
