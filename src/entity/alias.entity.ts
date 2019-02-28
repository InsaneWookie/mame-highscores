import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserGroup } from './usergroup.entity';
import { User } from './user.entity';
import { Score } from "./score.entity";

@Entity()
export class Alias {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @ManyToOne(type => UserGroup, ug => ug.aliases)
  @JoinColumn({ name: "user_group_id" })
  userGroup: UserGroup;

  @OneToMany(type => Score, s => s.alias)
  scores: Score[];
}
