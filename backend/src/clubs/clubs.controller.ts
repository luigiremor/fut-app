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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { InviteClubDto } from './dto/invite-club.dto';
import { UserClubService } from 'src/user-club/user-club.service';
import { CreateInviteLinkDto } from './dto/create-invite-link.dto';

@Controller('clubs')
export class ClubsController {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly userClubService: UserClubService,
  ) {}

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

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.clubsService.findOneByName(name);
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubsService.updateByName(name, updateClubDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.clubsService.removeByName(name);
  }

  @UseGuards(AuthGuard)
  @Get('user/me')
  findClubsByUser(@Req() request: any) {
    const userId = request.user.sub;
    return this.clubsService.findClubsByUser(userId);
  }

  @UseGuards(AuthGuard)
  @Post('invite')
  async generateInviteLink(
    @Body() createInviteLinkDto: CreateInviteLinkDto,
    @Req() request: any,
  ) {
    const userId = request.user.sub;
    const hasUserAdminPermission =
      await this.userClubService.hasUserAdminPermission(
        userId,
        createInviteLinkDto.clubId,
      );

    if (!hasUserAdminPermission) {
      throw new HttpException(
        'You do not have permission to generate an invite link',
        HttpStatus.FORBIDDEN,
      );
    }

    const inviteLink = await this.clubsService.generateInviteLink(
      createInviteLinkDto.clubId,
    );
    return { inviteLink };
  }

  @UseGuards(AuthGuard)
  @Post('join')
  async joinClub(@Body() inviteClubDto: InviteClubDto, @Req() request: any) {
    const userId = request.user.sub;
    return this.clubsService.joinClub(inviteClubDto, userId);
  }
}
