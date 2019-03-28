import { Injectable } from '@nestjs/common';
import { Machine } from "../entity/machine.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Group } from "../entity/group.entity";
import * as uuid from 'uuid/v4';

@Injectable()
export class MachineService {

  constructor(
    @InjectRepository(Machine) private readonly machine: Repository<Machine>,
    @InjectRepository(Group) private readonly group: Repository<Group>
  ){

  }

  async findAll(groupId: number): Promise<Machine[]>{
    return this.machine.find({where: {group: groupId}});
  }

  async find(groupId: number, id: number): Promise<Machine>{
    return this.machine.findOne({where: {id: id, group: groupId}});
  }

  async create(groupId: number, machine: Machine) {

    machine.api_key = uuid();
    machine.group = await this.group.findOne(groupId);
    return this.machine.save(machine);
  }
}
