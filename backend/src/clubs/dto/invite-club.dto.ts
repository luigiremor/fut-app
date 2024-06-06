import { IsString, IsUUID } from 'class-validator';

export class InviteClubDto {
  @IsUUID()
  clubId: string;

  @IsString()
  inviteToken: string;
}
