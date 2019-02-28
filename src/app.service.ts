import { Injectable } from '@nestjs/common';
// import { InjectRepository  } from '@nestjs/typeorm';
// import { Repository, getConnection } from 'typeorm';
// import { GamePlayed } from "./entity/gameplayed.entity";
// import { Machine } from "./machine.entity";
// import { Game } from "./entity/game.entity";
// import { User } from "./entity/user.entity";

@Injectable()
export class AppService {
  // constructor(
  //   @InjectRepository(GamePlayed)
  //   private readonly gamePlayed: Repository<GamePlayed>,
  //   @InjectRepository(Machine)
  //   private readonly machine: Repository<Machine>,
  //   @InjectRepository(Game)
  //   private readonly game: Repository<Game>,
  //   @InjectRepository(User)
  //   private readonly user: Repository<User>,
  // ) {}
  //
  //
  // // findOneByToken(): string {
  // //
  // // }
  //
  // async getHello(): Promise<Game[]> {
  //   // return 'Hello World!';
  //   //return this.new();
  //   // return await this.game.findOne(1, {relations: ["gameplayed"]});
  //
  //   // return await this.game.createQueryBuilder('game')
  //   //   .leftJoin('game.gameplayed', 'gp')
  //   //   .leftJoin('gp.machine', 'm')
  //   //   .where('m.group_id = :groupId', {groupId: 2})
  //   //   .getMany();
  //
  //   let query = getConnection().createQueryBuilder().select('gp.*')
  //     .from('gameplayed', 'gp')
  //     .leftJoinAndSelect('gp.machine', 'm', 'gp.machine_id = m.id')
  //     .where('m.group_id = :groupId')
  //     .getQuery();
  //
  //   let q = this.gamePlayed.createQueryBuilder('gp')
  //     .leftJoinAndSelect('gp.machine', 'm')
  //     .where('m.group_id = :groupId')
  //     .getQuery();
  //
  //   return await this.game.createQueryBuilder('game')
  //    .leftJoinAndSelect(`(${q})`, 'played', 'game.id = played.gp_game_id')
  //    //  .leftJoinAndSelect(GamePlayed, 'gameplayed', 'played.gp_id = gameplayed.id')
  //     .leftJoinAndMapOne('game.gameplayed', 'game.gameplayed', 'gameplayed', 'played.gp_id = gameplayed.game_id')
  //    .setParameter("groupId", 2)
  //     .getMany()
  //
  //   //select * from "gameplayed" "gp"
  //   // LEFT JOIN  "machine" "m" ON "m"."id" = "gp"."machine_id" WHERE m.group_id = 2
  // }
  //
  //
  //
  // async saveUser(data: object): Promise<User> {
  //
  //   let user = await this.user.create(data);
  //   return await this.user.save(user);
  // }


}
