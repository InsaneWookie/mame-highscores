import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MachineService } from "./machine.service";
import { Machine } from "../entity/machine.entity";
import { AdminGuard } from "../auth/admin-auth.guard";

@Controller('machine')
@UseGuards(AuthGuard(), AdminGuard)
export class MachineController {

  constructor(private readonly machineService: MachineService){

  }

  @Get()
  findAll(@Req() req){
    return this.machineService.findAll(req.user.groupId);
  }

  @Get(':id')
  find(@Param('id') id, @Req() req){

    return this.machineService.find(req.user.groupId, id);
  }

  @Post()
  save(@Req() req, @Body() body){
    return this.machineService.create(req.user.groupId, body as Machine);
  }
}
