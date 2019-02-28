import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Alias } from './alias.entity';
import { Group } from './group.entity';
import { UserGroup } from './usergroup.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 500})
  username: string;

  @Exclude()
  @Column('text')
  password: string;

  @Column('text')
  email: string;

  @Exclude()
  @Column({type: 'text', name: 'invite_code'})
  inviteCode: string;

  @CreateDateColumn({type: 'timestamptz'})
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(type => Group, group => group.users)
  groups: Group[];

  @OneToMany(type => UserGroup, userGroup => userGroup.user)
  userGroups: UserGroup[];
}
