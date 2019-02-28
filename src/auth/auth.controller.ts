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
}
