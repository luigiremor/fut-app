import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { MatchService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RecordGoalDto } from './dto/record-goal.dto';
import { ConfirmParticipationDto } from './dto/confirm-participation.dto';

@UseGuards(AuthGuard)
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Post(':id/confirm')
  async confirmParticipation(
    @Param('id') id: string,
    @Req() request: any,
    @Body() confirmParticipationDto: ConfirmParticipationDto,
  ) {
    console.log('confirmParticipationDto', confirmParticipationDto);
    const userId = request.user.sub;
    confirmParticipationDto.matchId = id;

    return this.matchService.confirmParticipation(
      userId,
      confirmParticipationDto,
    );
  }

  @Post(':id/divide-teams')
  async divideTeams(@Param('id') id: string) {
    return this.matchService.divideTeams(id);
  }

  @Post(':id/record-goal')
  async recordGoal(
    @Param('id') id: string,
    @Body() recordGoalDto: RecordGoalDto,
  ) {
    return this.matchService.recordGoal({
      matchId: id,
      userId: recordGoalDto.userId,
      team: recordGoalDto.team,
    });
  }

  @Post(':id/delete-goal')
  async deleteGoal(
    @Param('id') id: string,
    @Body() recordGoalDto: RecordGoalDto,
  ) {
    return this.matchService.deleteGoal({
      matchId: id,
      userId: recordGoalDto.userId,
      team: recordGoalDto.team,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const match = await this.matchService.findOne(id);

    return match;
  }

  @Get('user/me/upcoming')
  async findUpcomingMatchesForUser(@Req() request: any) {
    const userId = request.user.sub;
    return this.matchService.findUpcomingMatchesForUser(userId);
  }

  @Get('user/me/past')
  async findPastMatchesForUser(@Req() request: any) {
    const userId = request.user.sub;
    return this.matchService.findPastMatchesForUser(userId);
  }

  @Get('club/:clubName/upcoming')
  async findUpcomingMatchesForClub(@Param('clubName') clubName: string) {
    return this.matchService.findUpcomingMatchesForClub(clubName);
  }
}
