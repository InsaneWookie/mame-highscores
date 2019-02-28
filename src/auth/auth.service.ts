import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from '../user/user.service';
import bcrypt = require('bcrypt');
import { User } from '../entity/user.entity';
import uuid = require('uuid/v4');

// import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
              private readonly userService: UserService) {
  }

  async createToken() {
    // const user: JwtPayload = { email: 'test@email.com' };
    // const accessToken = this.jwtService.sign(user);
    // console.log(accessToken);
    // return {
    //   expiresIn: 3600,
    //   accessToken,
    // };
  }

  async login(userName: string, password: string) {
    const u = await this.userService.findByUserName(userName);

    if (!u) {
      throw 'User not found: ' + userName;
    }

    if (!u.groups.length) {
      throw 'No group for this user: ' + u.id;
    }

    if (u.groups.length > 1) {
      throw 'More than group per user not supported yet, user: ' + u.id;
    }

    if (u.password === null) {
      u.inviteCode = uuid();
      await this.userService.save(u);
      return {
        registrationRequired: true,
        inviteCode: u.inviteCode
      };
    }

    if (!await this.isValidPassword(password, u.password)) {
      throw 'Invalid password'; //TODO: 401?
    }

    const user: JwtPayload = {
      userId: u.id,
      groupId: u.groups[0].id
    };

    // console.log(user);
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: 3600,
      accessToken,
      userId: u.id,
    };
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

    if (!body.invite_code) {
      throw 'Invite code not set';
    }

    if(!body.username || body.username.trim() === ''){
      throw "Invalid user name"
    }

    const inviteCode = body.invite_code;
    const user = await this.userService.findOneByInviteCode(inviteCode);

    if (!user) {
      throw 'Invalid invite code';
    }

    const userName = body.username;
    const password = body.password;
    const email = body.email;

    user.username = userName;
    user.password = await this.hashPassword(password);
    user.email = email;
    user.inviteCode = null;

    const newUser = await this.userService.save(user);
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

    return false;

  }
}
