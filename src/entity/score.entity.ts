import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Group } from './group.entity';
import { Machine } from './machine.entity';
import { Game } from './game.entity';
import { Alias } from "./alias.entity";
import { User } from "./user.entity";

@Entity()
export class Score {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  score: string;

  @Column()
  rank: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(type => Alias, a => a.scores)
  @JoinColumn({ name: "alias_id" })
  alias: Alias;

  user: User;

  @ManyToOne(type => Machine, m => m.scores)
  @JoinColumn({ name: "machine_id" })
  machine: Machine;

  @ManyToOne(type => Game, g => g.scores)
  @JoinColumn({ name: "game_id" })
  game: Game;
}
