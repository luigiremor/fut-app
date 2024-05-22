import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get(':username')
  async getUser(@Param('username') username: string) {
    return this.userService.findUser(username);
  }
}
