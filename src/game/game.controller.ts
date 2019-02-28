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
  UseInterceptors, FileInterceptor, UploadedFile
} from '@nestjs/common';
import { Game } from '../entity/game.entity';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('game')
@UseGuards(AuthGuard())
export class GameController {

  constructor(private readonly gameService: GameService) {
  }

  @Get('top_players')
  top_players(@Req() req): Promise<any> {
    const groupId = req.user.groupId;
    return this.gameService.findTopPlayers(groupId);
  }

  @Get()
  findAll(@Req() req, @Query() params): Promise<Game[]> {
    // Logger.log('game route');
    // Logger.log(req.user);
    const groupId = req.user.groupId;
    // const sort = params.sort || 'name ASC';
    return this.gameService.findAll(groupId);
  }

  @Get(':id')
  // @UseGuards(AuthGuard())
  find(@Param('id') id): Promise<Game> {
    const groupId = 1; // req.user.groupId;
    return this.gameService.find(id, groupId);
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('filename'))
  upload(@UploadedFile() file, @Req() req){

    return this.gameService.upload(req.body.gamename, 1, file);
  }

}
