import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserClubService } from './user-club.service';
import { CreateUserClubDto } from './dto/create-user-club.dto';
import { UpdateUserClubDto } from './dto/update-user-club.dto';
import { UserRole } from './entities/user-club.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user-club')
export class UserClubController {
  constructor(private readonly userClubService: UserClubService) {}

  @Post()
  create(@Body() createUserClubDto: CreateUserClubDto) {
    return this.userClubService.create(createUserClubDto);
  }

  @Get()
  findAll() {
    return this.userClubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userClubService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateUserClubDto: UpdateUserClubDto,
  ) {
    const userId = req.user.sub;

    const userClub = await this.userClubService.findOne(id);

    console.log('userClub', userClub);

    const hasUserPermission =
      await this.userClubService.hasUserAdminPermissionByClubId(
        userId,
        updateUserClubDto.clubId,
      );

    console.log('hasUserPermission', hasUserPermission);

    if (!hasUserPermission) {
      throw new HttpException(
        'You are not allowed to update this user role',
        HttpStatus.FORBIDDEN,
      );
    }

    if (updateUserClubDto.role === UserRole.OWNER) {
      throw new HttpException(
        'You are not allowed to update user role to owner',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userClub.user.id === userId) {
      throw new HttpException(
        'You are not allowed to update your own user role',
        HttpStatus.FORBIDDEN,
      );
    }

    console.log('updateUserClubDto', updateUserClubDto);

    return this.userClubService.update(id, updateUserClubDto);
  }

  @UseGuards(AuthGuard)
  @Get('club/:clubName/users')
  async getUsersWithRolesForClubByName(
    @Param('clubName') clubName: string,
    @Req() req,
  ) {
    const userId = req.user.sub;

    return this.userClubService.getUsersWithRolesForClubByName(
      clubName,
      userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userClubService.remove(+id);
  }
}
