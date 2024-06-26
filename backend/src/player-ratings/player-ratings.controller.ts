import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PlayerRatingsService } from './player-ratings.service';
import { CreatePlayerRatingDto } from './dto/create-player-rating.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('player-ratings')
export class PlayerRatingsController {
  constructor(private readonly playerRatingsService: PlayerRatingsService) {}

  @Post()
  async create(
    @Body() createPlayerRatingDto: CreatePlayerRatingDto,
    @Req() request: any,
  ) {
    const reviewerId = request.user.sub;
    console.log(reviewerId);
    console.log(createPlayerRatingDto);

    return this.playerRatingsService.create(createPlayerRatingDto, reviewerId);
  }
}
