import { Injectable } from '@nestjs/common';
import { Group } from "../entity/group.entity";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { Machine } from "../entity/machine.entity";

@Injectable()
export class GroupService {

  constructor(
    @InjectRepository(Group)
    private readonly group: Repository<Group>
  ) {}


  async findOneByInviteCode(inviteCode: string) {
    return this.group.findOne({where: {invite_code: inviteCode}});
  }

  async findOne(groupId: number): Promise<Group>{
    return this.group.findOne(groupId);
  }

  async save(group: Group) {
    return this.group.save(group);
  }
}
