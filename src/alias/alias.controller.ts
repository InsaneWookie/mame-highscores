import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AliasService } from "./alias.service";

@Controller('alias')
@UseGuards(AuthGuard())
export class AliasController {

  constructor(private readonly aliasService: AliasService) {
  }

  @Post()
  create(@Req() req, @Body() body){


    const groupId = req.user.groupId;

    if(!body.length){
      return [];
    }

    //check that all the user ids are valid for this user
    const invalid = body.some(alias => alias.user !== req.user.user.id); //if we find one id that doesn't match the logged in user then error

    if(invalid){
      throw "Invalid user in alias"
    }

    return this.aliasService.saveAll(body, groupId)

  }

  @Post('delete')
  delete(@Req() req, @Body() body){
    //TODO check valid to delete

    if(!body.length){
      return [];
    }

    //TODO: check all deletes are valid for logged in user


    return this.aliasService.removeAll(body);
  }

}
