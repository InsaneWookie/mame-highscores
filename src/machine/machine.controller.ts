import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MachineService } from "./machine.service";
import { Machine } from "../entity/machine.entity";

@Controller('machine')
@UseGuards(AuthGuard())
export class MachineController {

  constructor(private readonly machineService: MachineService){

  }

  @Get()
  findAll(@Req() req){
    return this.machineService.findAll(req.user.groupId);
  }

  @Post()
  save(@Req() req, @Body() body){
    return this.machineService.save(req.user.groupId, body as Machine);
  }
}
