import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  async login(@Body() body) {
    return await this.authService.login(body.username, body.password);
  }

  @Post('register')
  async register(@Body() body) {
    return await this.authService.register(body);
  }

  @Post('request_password_reset')
  async requestPasswordReset(@Body() body){
    return await this.authService.requestPasswordReset(body.username);
  }

  @Post('reset_password')
  async resetPassword(@Body() body){
    return await this.authService.resetPassword(body);
  }
}
