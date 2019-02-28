import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

  constructor(private readonly userService: UserService) {
  }

  @Post('invite')
  async invite(@Req() req, @Body() body) {
    const groupId = req.user.groupId;
    const inviteEmail = body.inviteEmail;
    const result = await this.userService.inviteUser(groupId, inviteEmail);

    return {success: true, inviteLink: `http://localhost:4200/#/register/${result.inviteCode}`}
  }

  @Get(':id')
  findOne(@Param('id') id, @Req() req): Promise<User> {
    const groupId = req.user.groupId;
    return this.userService.findOne(id, groupId);
  }

  @Get()
  async find(@Req() req): Promise<User[]> {
    const groupId = req.user.groupId;
    return await this.userService.find(groupId);
  }
}
