import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('group')
@UseGuards(AuthGuard())
export class GroupController {}
