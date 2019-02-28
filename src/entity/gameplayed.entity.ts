import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Machine } from "./machine.entity";
import { Game } from "./game.entity";

@Entity({name: 'gameplayed'})
export class GamePlayed {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  date_time: Date;

  @Column()
  play_count: number;

  @Column('timestamp')
  createdAt: Date;

  @OneToOne(type => Machine)
  @JoinColumn({
    name: "machine_id",
    referencedColumnName: "id"
  })
  machine: Machine;

  @OneToOne(type => Game)
  @JoinColumn({
    name: "game_id",
    referencedColumnName: "id"
  })
  game: Game;

}