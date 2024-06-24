import { IsEnum, IsUUID } from 'class-validator';

export class ConfirmParticipationDto {
  @IsUUID()
  matchId: string;

  @IsEnum(['GK', 'DEF', 'MID', 'FWD'])
  position: string;
}
