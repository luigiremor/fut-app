import { IsString } from 'class-validator';

export class InviteClubDto {
  @IsString()
  clubName: string;

  @IsString()
  inviteToken: string;
}
