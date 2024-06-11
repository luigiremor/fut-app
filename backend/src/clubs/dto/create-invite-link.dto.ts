import { IsString } from 'class-validator';

export class CreateInviteLinkDto {
  @IsString()
  clubName: string;
}
