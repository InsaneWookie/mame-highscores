import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post, Put,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from "../auth/auth.service";
import { isEmpty } from 'lodash'

@Controller('user')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

  constructor(private readonly userService: UserService,
              private authService : AuthService) {
  }

  @Post('invite')
  async invite(@Req() req, @Body() body) {
    const groupId = req.user.groupId;
    const inviteEmail = body.inviteEmail;
    const result = await this.userService.inviteUser(groupId, inviteEmail);

    return {success: true, inviteLink: `http://localhost:4200/#/register/${result.inviteCode}`}
  }

  // @Get(':id/scores')
  @Put(':id')
  async save(@Param('id') id, @Req() req, @Body() body){
    const groupId = req.user.groupId;
    const userId = req.user.user.id;

    if(userId != id){
      throw "can only update yourself";
    }

    let user = await this.userService.findOne(userId, groupId);

    if (!user) {
      throw "User not found"
    }

    if(!isEmpty(body.currentPassword)){
      const isValidPassword = await this.authService.isValidPassword(body.currentPassword, user.password);
      if(!isValidPassword){
        throw "Invalid current password"
      }

      if(body.newPassword !== body.repeatNewPassword){
        throw "Passwords do not match"
      }

      user.password = await this.authService.hashPassword(body.newPassword);
      //user.email = body.email;
    }


    return await this.userService.save(user);
  }


  @Get(':id')
  async findOne(@Param('id') id, @Req() req): Promise<User> {
    const groupId = req.user.groupId;
    let user = await this.userService.findOne(id, groupId);
    let userPoints = await this.userService.getPoints(groupId, user.id);
     // console.log(userPoints);
    user.points = (userPoints.length === 0) ? 0 : userPoints[0].total_points;
    // console.log(user);
    return user;
  }

  @Get()
  async find(@Req() req): Promise<User[]> {
    const groupId = req.user.groupId;
    return await this.userService.find(groupId);
  }
}
