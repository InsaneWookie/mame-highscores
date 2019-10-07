import { Injectable} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { DeleteResult, getConnection, Repository } from 'typeorm';
import { InjectRepository  } from '@nestjs/typeorm';
import { UserGroup } from '../entity/usergroup.entity';
import uuid = require('uuid/v4');
import { promises } from "fs";
import { AuthService } from "../auth/auth.service";
import { AppLogger } from "../applogger.service";
import { AliasService } from "../alias/alias.service";
import { Alias } from "../entity/alias.entity";
import { Score } from "../entity/score.entity";

@Injectable()
export class UserService {

  constructor(@InjectRepository(User)
              private readonly userRepository: Repository<User>,
              @InjectRepository(UserGroup)
              private readonly userGroupRepo: Repository<UserGroup>,
              @InjectRepository(Alias)
              private readonly aliasRepo: Repository<Alias>,
              @InjectRepository(Score)
              private readonly scoreRepo: Repository<Score>,
            //  private readonly aliasService: AliasService,
            //   private readonly l: AppLogger
              ) {
    // l.log("this is a test", "UserService");
  }


  async find(groupId: number): Promise<User[]> {
    return await this.userRepository.createQueryBuilder('user')
      .innerJoin('user.userGroups', 'ug')
      .where('ug.group_id = :groupId', {groupId})
      .getMany();
  }

  async findOne(id, groupId: number): Promise<User> {
    return await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.userGroups', 'ug')
      .leftJoinAndSelect('ug.aliases', 'a', 'ug.id = a.user_group_id')
      .where('ug.group_id = :groupId', {groupId})
      .andWhere('user.id = :id', {id})
      .getOne();
  }

  async findOneByInviteCode(inviteCode): Promise<User>{
    return await this.userRepository.findOne({inviteCode});
  }

  async fundOneByResetToken(token: string ){
    return await this.userRepository.findOne({passwordResetToken: token});
  }

  async findByUserName(userName: string): Promise<User> {
    return await this.userRepository.findOne({where: {username: userName}, relations: ['groups']});
  }

  async save(user: User, groupId?: number, isNew?: boolean): Promise<User> {

    const newUser = await this.userRepository.save(user);

    if(groupId) {
      let values: any = {group: groupId, user: user.id};
      if(isNew){
        values.isAdmin = true;
      }
      await this.userGroupRepo.createQueryBuilder('ug').insert().into('user_group')
        .values(values)
        .execute();
    }
    return newUser;
  }

  async delete(user: User): Promise<User> {

    //unlink user group

    //if they are they have no more user groups then delete the user record

    //unlink alias
    // await this.scoreRepo.delete({ where: { alias: 1}});
    //
    //
    // await this.aliasRepo.delete({where: {user: 1}});

    return await this.userRepository.remove(user);
  }

  async inviteUser(groupId: number, inviteEmail: string): Promise<User>{

    const newUser = new User();
    newUser.email = inviteEmail;
    newUser.inviteCode = uuid();

    return this.save(newUser, groupId);
  }

  async getPoints(groupId: number, userId: number): Promise<any> {

    const pointsQuery =
      ' SELECT u.id, u.username, player_total_points.total_points \
        FROM \
        (SELECT user_id, sum(points) total_points \
         FROM \
           (SELECT s.game_id, ug.user_id, min (s.rank) top_rank, \
           CASE \
           WHEN min (s.rank) = 1 THEN 8 \
           WHEN min (s.rank) = 2 THEN 5 \
           WHEN min (s.rank) = 3 THEN 3 \
           WHEN min (s.rank) = 4 THEN 2 \
           WHEN min (s.rank) = 5 THEN 1 \
           ELSE 0 \
           END as points \
           FROM user_group ug \
           JOIN alias a ON ug.id = a.user_group_id \
              JOIN score s ON a.id = s.alias_id \
           WHERE \
            ug.group_id = $1 \
            AND s.rank <= 5 \
           GROUP BY s.game_id, ug.user_id ) player_points \
         GROUP BY user_id \
        ) \
        player_total_points, \
                "user" u \
      WHERE player_total_points.user_id = u.id \
      AND u.id = $2' +
      // extraWhere +
      'ORDER BY total_points DESC';

    return getConnection().query(pointsQuery, [groupId, userId]);

  }

  async findByEmail(email: any) {
    return await this.userRepository.findOne({where: {email: email}, relations: ['groups']});
  }

}
