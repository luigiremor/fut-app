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
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateUserClubDto: UpdateUserClubDto,
  ) {
    const userId = req.user.id;

    const hasUserPermission = this.userClubService.hasUserAdminPermission(
      userId,
      updateUserClubDto.clubId,
    );

    if (!hasUserPermission) {
      throw new Error('You are not allowed to update this user role');
    }

    if (updateUserClubDto.role === UserRole.OWNER) {
      throw new Error('You are not allowed to update user role to owner');
    }

    if (updateUserClubDto.userId === userId) {
      throw new Error('You are not allowed to update your own user role');
    }

    return this.userClubService.update(id, updateUserClubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userClubService.remove(+id);
  }
}
