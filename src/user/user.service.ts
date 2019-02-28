import { Injectable} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository  } from '@nestjs/typeorm';
import { UserGroup } from '../entity/usergroup.entity';
import uuid = require('uuid/v4');
import { promises } from "fs";

@Injectable()
export class UserService {

  constructor(@InjectRepository(User)
              private readonly userRepository: Repository<User>,
              @InjectRepository(UserGroup)
              private readonly userGroupRepo: Repository<UserGroup>) {
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

  async findByUserName(userName: string): Promise<User> {
    return await this.userRepository.findOne({where: {username: userName}, relations: ['groups']});
  }

  async save(user: User, groupId?: number): Promise<User> {

    const newUser = await this.userRepository.save(user);

    if(groupId) {
      await this.userGroupRepo.createQueryBuilder('ug').insert().into('user_group')
        .values({group: groupId, user: user.id})
        .execute();
    }
    return newUser;
  }

  async inviteUser(groupId: number, inviteEmail: string): Promise<User>{

    const newUser = new User();
    newUser.email = inviteEmail;
    newUser.inviteCode = uuid();

    return this.save(newUser, groupId);
  }

}
