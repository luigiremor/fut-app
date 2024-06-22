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

@UseGuards(AuthGuard)
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Post(':id/confirm')
  async confirmParticipation(@Param('id') id: string, @Req() request: any) {
    const userId = request.user.sub;
    const confirmParticipationDto = { matchId: id };
    return this.matchService.confirmParticipation(
      userId,
      confirmParticipationDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.matchService.findOne(id);
  }
}
