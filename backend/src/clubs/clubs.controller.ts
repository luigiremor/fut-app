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
  async findClubsByUser(@Req() request: any) {
    const userId = request.user.sub;
    const user = await this.clubsService.findClubsByUser(userId);
    return user;
  }

  @UseGuards(AuthGuard)
  @Get(':name/is-admin')
  async isUserAdmin(@Param('name') name: string, @Req() request: any) {
    const userId = request.user.sub;

    const club = await this.clubsService.findOneByName(name);

    return await this.userClubService.hasUserAdminPermissionByClubId(
      userId,
      club.id,
    );
  }

  @UseGuards(AuthGuard)
  @Post('invite')
  async generateInviteLink(
    @Body() createInviteLinkDto: CreateInviteLinkDto,
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    const club = await this.clubsService.findOneByName(
      createInviteLinkDto.clubName,
    );

    const hasUserAdminPermissionByClubId =
      await this.userClubService.hasUserAdminPermissionByClubId(
        userId,
        club.id,
      );

    if (!hasUserAdminPermissionByClubId) {
      throw new HttpException(
        'You do not have permission to generate an invite link',
        HttpStatus.FORBIDDEN,
      );
    }

    const inviteLink = await this.clubsService.generateInviteLink(
      createInviteLinkDto.clubName,
    );
    return { inviteLink };
  }

  @UseGuards(AuthGuard)
  @Post('join')
  async joinClub(@Body() inviteClubDto: InviteClubDto, @Req() request: any) {
    const userId = request.user.sub;

    console.log('inviteClubDto', inviteClubDto);

    const club = await this.clubsService.findOneByName(inviteClubDto.clubName);

    const userClub = await this.userClubService.findUserClubByUserIdAndClubId(
      userId,
      club.id,
    );

    if (userClub) {
      throw new HttpException(
        'You are already a member of this club',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.clubsService.joinClub(inviteClubDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get(':name/users/most-active')
  async findMostActiveUsers(@Param('name') name: string) {
    return this.clubsService.getMostActiveUsers(name);
  }

  @UseGuards(AuthGuard)
  @Get(':name/users/most-ranked')
  async findRankings(@Param('name') name: string) {
    return this.clubsService.getMostRankedUsers(name);
  }

  @UseGuards(AuthGuard)
  @Get(':name/users/most-goals')
  async findMostGoals(@Param('name') name: string) {
    return this.clubsService.getMostScorers(name);
  }
}
