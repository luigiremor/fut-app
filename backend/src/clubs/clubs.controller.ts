import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createClubDto: CreateClubDto, @Req() request: any) {
    const user = request.user;

    return this.clubsService.create(createClubDto, user.sub);
  }

  @Get()
  findAll() {
    return this.clubsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Get('user/me')
  findClubsByUser(@Req() request: any) {
    const userId = request.user.sub;

    return this.clubsService.findClubsByUser(userId);
  }
}
