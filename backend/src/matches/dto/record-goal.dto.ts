import { IsString } from 'class-validator';

export class RecordGoalDto {
  @IsString()
  userId: string;

  @IsString()
  team: 'A' | 'B';
}
