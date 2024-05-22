import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: CreateUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.validateUser(
      createUserDto.username,
      createUserDto.password,
    );

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile() {
    return 'Profile';
  }
}
