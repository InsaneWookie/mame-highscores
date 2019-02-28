import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { GamePlayed } from "./gameplayed.entity";
import { Score } from './score.entity';

@Entity({name: 'game'})
export class Game {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  full_name: string;

  @Column()
  has_mapping: boolean;

  @Column()
  clone_of: string;

  @Column()
  clone_of_name: string;

  @Column()
  letter: string;

  @Column()
  order: string;

  @Column()
  sort: string;

  @Column()
  year: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(type => Score, s => s.game)
  scores: Score[];

  @OneToOne(type => GamePlayed, gp => gp.game) // specify inverse side as a second parameter
  gameplayed: GamePlayed;

  latestPlayed: GamePlayed;

}
