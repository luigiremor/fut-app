import { IsEnum, IsString } from 'class-validator';

enum Team {
  A = 'A',
  B = 'B',
}

export class RecordGoalDto {
  @IsString()
  userId: string;

  @IsEnum(Team)
  team: Team;
}
