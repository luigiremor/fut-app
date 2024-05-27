import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserClubService } from './user-club.service';
import { CreateUserClubDto } from './dto/create-user-club.dto';
import { UpdateUserClubDto } from './dto/update-user-club.dto';

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserClubDto: UpdateUserClubDto,
  ) {
    return this.userClubService.update(id, updateUserClubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userClubService.remove(+id);
  }
}
