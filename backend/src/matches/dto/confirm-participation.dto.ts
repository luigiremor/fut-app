import { IsEnum, IsUUID } from 'class-validator';

enum Position {
  GK = 'GK',
  DEF = 'DEF',
  MID = 'MID',
  FWD = 'FWD',
}

export class ConfirmParticipationDto {
  @IsUUID()
  matchId: string;

  @IsEnum(Position)
  position: Position;
}
