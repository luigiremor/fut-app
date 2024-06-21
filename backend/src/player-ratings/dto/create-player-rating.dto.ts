import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreatePlayerRatingDto {
  @IsUUID()
  matchId: string;

  @IsUUID()
  revieweeId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
