import {
  Controller,
  Get,
  Session,
  Request,
  Post,
  Query,
  UseGuards,
  Req,
  Param,
  Logger,
  UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { Game } from '../entity/game.entity';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('game')

export class GameController {

  constructor(private readonly gameService: GameService) {
  }

  @Get('top_players')
  @UseGuards(AuthGuard())
  top_players(@Req() req): Promise<any> {
    const groupId = req.user.groupId;
    return this.gameService.findTopPlayers(groupId);
  }

  @Get('latest_scores')
  @UseGuards(AuthGuard())
  latest_scores(@Req() req): Promise<any> {
    const groupId = req.user.groupId;
    return this.gameService.findLatestScores(groupId);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Req() req, @Query() params): Promise<Game[]> {
    const groupId = req.user.groupId;
    // const sort = params.sort || 'name ASC';
    return this.gameService.findAll(groupId);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  find(@Param('id') id, @Req() req): Promise<Game> {
    const groupId = req.user.groupId;
    return this.gameService.find(id, groupId);
  }

  /**
   * TODO: check the api key
   * @param apiKey
   * @param file
   * @param req
   */
  @Post('upload/:apiKey')
  @UseInterceptors(FileInterceptor('game'))
  upload(@Param('apiKey') apiKey, @UploadedFile() file, @Req() req){
    return this.gameService.upload(req.body.gamename, apiKey, file);
  }

}
