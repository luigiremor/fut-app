import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Pick<User, 'id' | 'username'> | null> {
    const user = await this.userService.findUser(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const { id, username } = await this.userService.findUser(user.username);

    const payload = { username: user.username, sub: id };

    return {
      id,
      username,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: { username: string; password: string }) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(userData.password, saltOrRounds);

    const newUser = await this.userService.createUser(userData.username, hash);
    const { password, ...result } = newUser;
    return result;
  }
}
