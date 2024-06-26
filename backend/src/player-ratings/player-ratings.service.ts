import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerRating } from './entities/player-rating.entity';
import { CreatePlayerRatingDto } from './dto/create-player-rating.dto';
import { MatchService } from '../matches/matches.service';
import { UserService } from '../user/user.service';

@Injectable()
export class PlayerRatingsService {
  constructor(
    @InjectRepository(PlayerRating)
    private playerRatingsRepository: Repository<PlayerRating>,
    private matchService: MatchService,
    private userService: UserService,
  ) {}

  async create(
    createPlayerRatingDto: CreatePlayerRatingDto,
    reviewerId: string,
  ): Promise<PlayerRating> {
    const match = await this.matchService.findOne(
      createPlayerRatingDto.matchId,
    );
    console.log(createPlayerRatingDto);
    console.log(match);

    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }

    console.log(match.confirmedUsers);

    const reviewer = await this.userService.findUserById(reviewerId);
    const reviewee = await this.userService.findUserById(
      createPlayerRatingDto.revieweeId,
    );

    console.log(reviewer);
    console.log(reviewee);

    if (
      !match.confirmedUsers.some((user) => user.id === reviewerId) ||
      !match.confirmedUsers.some(
        (user) => user.id === createPlayerRatingDto.revieweeId,
      )
    ) {
      throw new HttpException(
        'Both reviewer and reviewee must be confirmed participants of the match',
        HttpStatus.FORBIDDEN,
      );
    }

    console.log(match.ratings);

    const existingRating = match.ratings.find(
      (rating) =>
        rating.reviewer.id === reviewerId &&
        rating.reviewee.id === createPlayerRatingDto.revieweeId,
    );
    if (existingRating) {
      console.log(existingRating);
      throw new HttpException('Rating already exists', HttpStatus.BAD_REQUEST);
    }

    console.log(existingRating);

    const playerRating = this.playerRatingsRepository.create({
      match,
      reviewer,
      reviewee,
      rating: createPlayerRatingDto.rating,
    });

    console.log(playerRating);

    return this.playerRatingsRepository.save(playerRating);
  }
}
