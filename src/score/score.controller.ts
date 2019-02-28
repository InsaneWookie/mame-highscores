import { ClassSerializerInterceptor, Controller, Get, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ScoreService } from "./score.service";
import { AuthGuard } from '@nestjs/passport';

@Controller('score')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class ScoreController {

  constructor(private readonly scoreService: ScoreService) {

  }

  @Get()
  async findAll(@Query() query, @Req() req){
    const groupId = req.user.groupId;
    const gameId = query.game || null;
    return await this.scoreService.findAll(groupId, gameId);
  }

}
