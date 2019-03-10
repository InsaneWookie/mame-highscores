import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupService } from "./group.service";

@Controller('group')
@UseGuards(AuthGuard())
export class GroupController {

  constructor(
    private readonly groupService: GroupService
  ) {


  }


  @Get()
  find(@Req() req){
    const groupId = req.user.groupId;
    return this.groupService.findOne(groupId);
  }
}
