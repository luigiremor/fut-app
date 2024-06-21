import { IsUUID } from 'class-validator';

export class ConfirmParticipationDto {
  @IsUUID()
  matchId: string;
}
