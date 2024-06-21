import { PartialType } from '@nestjs/swagger';
import { CreatePlayerRatingDto } from './create-player-rating.dto';

export class UpdatePlayerRatingDto extends PartialType(CreatePlayerRatingDto) {}
