import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { Alias } from "../entity/alias.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from "../entity/usergroup.entity";
import { GameService } from "../game/game.service";

@Injectable()
export class AliasService {

  constructor(@InjectRepository(Alias)
              private readonly aliasRepository: Repository<Alias>,
              @InjectRepository(UserGroup)
              private readonly userGroupRepository: Repository<UserGroup>,
              private readonly gameService: GameService) {
  }

  async saveAll(body: any, userId : any, groupId? : any) : Promise<Alias[]>{

    const aliases: any[] = body;
    const newAliases: Alias[] = [];

    //for now we assume that its the same user for all aliases
    //const userId = aliases[0].user;
    const userGroup = await this.userGroupRepository
      .findOne({user: userId, group: groupId});


    aliases.forEach((a) => {
      const alias = new Alias();
      alias.name = a.name;
      alias.userGroup = userGroup;
      newAliases.push(alias);
    });

    let result = await this.aliasRepository.save(newAliases);

   await this.gameService.updateScoreAliasesByUser(groupId, userId);
   // await this.gameService.updateRanks()

    return result;
  }

  async removeAll(body: any, groupId? : any) : Promise<Alias[]>{

    const aliases: any[] = body;
    const newAliases: Alias[] = [];

    //for now we assume that its the same user for all aliases
    // const userId = aliases[0].user;
    // const userGroup = await this.userGroupRepository
    //   .findOne({user: userId, group: groupId});


    aliases.forEach((a) => {
      const alias = new Alias();
      alias.id = a.id;
      //alias.userGroup = userGroup;
      newAliases.push(alias);
    });

    return this.aliasRepository.remove(newAliases)
  }
}
