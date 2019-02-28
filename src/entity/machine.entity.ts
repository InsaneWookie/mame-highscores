import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { GamePlayed } from "./gameplayed.entity";
import { UserGroup } from './usergroup.entity';
import { Group } from './group.entity';
import { Score } from './score.entity';

@Entity({name: 'machine'})
export class Machine {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  //
  @ManyToOne(type => Group, g => g.machines)
  @JoinColumn({ name: "group_id" })
  group: Group;

  @OneToMany(type => Score, s => s.machine)
  scores: Score[];

  @OneToOne(type => GamePlayed, gp => gp.machine) // specify inverse side as a second parameter
  gameplayed: GamePlayed;


}
