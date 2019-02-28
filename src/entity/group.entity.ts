import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserGroup } from './usergroup.entity';
import { Machine } from './machine.entity';

@Entity({name: 'group'})
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @OneToMany(type => Machine, m => m.group)
  machines: Machine[];

  @ManyToMany(type => User, user => user.groups)
  @JoinTable({
    name: 'user_group',
    joinColumns: [{ name: 'group_id' }],
    inverseJoinColumns: [{ name: 'user_id' }]
  })
  users: User[];

  @OneToMany(type => UserGroup, userGroup => userGroup.group)
  userGroups: UserGroup[];
}
