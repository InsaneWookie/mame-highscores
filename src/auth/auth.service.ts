import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from '../user/user.service';
import { User } from '../entity/user.entity';
import { ConfigService } from "../config/config.service";
import { GroupService } from "../group/group.service";
import { Group } from "../entity/group.entity";
import { Machine } from "../entity/machine.entity";
import { MachineService } from "../machine/machine.service";
import { LoginResponse } from "./login-response.interface"
import { LoginErrorResponse } from "./login-error-response.interface";
import * as uuid from "uuid/v4";
import { MailerService } from "../mailer/mailer.service";
import bcrypt = require('bcrypt');

// import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService,
              private readonly userService: UserService,
              private readonly groupService: GroupService,
              private readonly machineService: MachineService,
              private readonly config: ConfigService,
              private readonly mailerService: MailerService) {
  }


  async login(userName: string, password: string) : Promise<LoginResponse | LoginErrorResponse> {

    let loginErrorResponse : LoginErrorResponse = {success: false, message: "Invalid username or password"};
    const u = await this.userService.findByUserName(userName);

    if (!u) {
      this.logger.log('User not found: ' + userName);
      return loginErrorResponse;
    }

    if (!u.groups.length) {
      this.logger.log( 'No group for this user: ' + u.id);
      return loginErrorResponse;
    }

    if (u.groups.length > 1) {
      this.logger.log('More than group per user not supported yet, user: ' + u.id);
      return loginErrorResponse;
    }

    // if (u.password === null) {
    //   u.inviteCode = uuid();
    //   await this.userService.save(u);
    //   return {
    //     registrationRequired: true,
    //     inviteCode: u.inviteCode
    //   };
    // }

    if (!await this.isValidPassword(password, u.password)) {
      this.logger.log('Invalid password');
      return loginErrorResponse;
    }

    const user: JwtPayload = {
      userId: u.id,
      groupId: u.groups[0].id
    };

    // console.log(user);
    const accessToken = this.jwtService.sign(user);
    // const decoded = this.jwtService.decode(accessToken);
    // console.log(decoded);

    return {
      success: true,
      expiresIn: parseInt(this.config.get('JWT_EXPIRES_IN')),
      accessToken,
      userId: u.id,
    } as LoginResponse;
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    // put some validation logic here
    // for example query user by id/email/username

    let user = await this.userService.findOne(payload.userId, payload.groupId);

    return {user, groupId: payload.groupId};
  }

  async register(body: any) {

    if (body.password !== body.repeat_password) {
      throw 'Passwords do not match';
    }

    // if (!body.invite_code) {
    //   throw 'Invite code not set';
    // }

    if(!body.username || body.username.trim() === ''){
      throw "Invalid user name"
    }

    let group: Group;
    let isNew = false;
    if(body.invite_code) {
      const inviteCode = body.invite_code;
      group = await this.groupService.findOneByInviteCode(inviteCode);

      if (!group) {
        throw 'Invalid invite code';
      }
    } else if(body.group_name && body.group_description){
      isNew = true;
      group = new Group();
      group.name = body.group_name;
      group.description = body.group_description;
      group.invite_code = Math.random().toString(36).slice(2,9);
      group = await this.groupService.save(group);

      const machine = new Machine();
      machine.name = 'Default Machine';
      // machine.group = group;
      await this.machineService.create(group.id, machine);

    } else {
      throw 'No invite code or group details provided'
    }

    const userName = body.username;
    const password = body.password;
    const email = body.email;

    let user = new User();
    user.username = userName;
    user.password = await this.hashPassword(password);
    user.email = email;
    user.inviteCode = null;

    // user.groups = [group];
    let newUser;
    if(group){
      newUser = await this.userService.save(user, group.id, isNew);
    } else {
      newUser = await this.userService.save(user);
    }

    //send confirm email?

    return this.login(newUser.username, password);

  }

  async hashPassword(password): Promise<string> {

    // const salt = await bcrypt.salt
    const hash = await bcrypt.hash(password, 10);

    return hash;
  }

  async isValidPassword(inputPassword, storedPassword) {
    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch (e) {
      //invalid password
      console.log(e);
      return false;
    }
  }

  async requestPasswordReset(userName: string){
    //find user
    const u = await this.userService.findByUserName(userName);

    //TODO: add reset timeout
    if(u && u.email){
      u.passwordResetToken = uuid();
      await this.userService.save(u);

      //TODO: nice email template
      const emailText = 'Please visit the following link to reset your password\n' +
        this.config.get("BASE_URL") + `/#/reset-password/${u.passwordResetToken}`;

      await this.mailerService.sendMail(u.email, "Password Reset Request", emailText);
    }

    //no user so just continue
    return {success: true}
  }

  async resetPassword(body: any) {
    const resetToken = body.passwordResetToken;
    const password = body.password;
    const repeatPassword = body.repeatPassword;

    if(resetToken && resetToken.length > 10){

      const user = await this.userService.fundOneByResetToken(resetToken);

      if(user && user.passwordResetToken === resetToken && password === repeatPassword){
        user.password = await this.hashPassword(password);
        user.passwordResetToken = null;
        await this.userService.save(user);
        return {success: true}
      }
    }

    return {success: false}
  }


}
