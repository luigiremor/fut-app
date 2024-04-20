import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() userData: { username: string; password: string }) {
    return this.userService.createUser(userData.username, userData.password);
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    return this.userService.findUser(username);
  }
}
