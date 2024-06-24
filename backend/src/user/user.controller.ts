import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() request: any) {
    const userId = request.user.sub;

    console.log(userId);

    return this.userService.findMe({
      userId,
    });
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    console.log('oi');
    return this.userService.findUser(username);
  }
}
