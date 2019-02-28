import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Alias } from './alias.entity';
import { Group } from './group.entity';

@Entity({name: 'user_group'})
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.userGroups)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(type => Group, group => group.userGroups)
  @JoinColumn({ name: "group_id" })
  group: Group;

  @OneToMany(type => Alias, alias => alias.userGroup)
  aliases: Alias[];


}
