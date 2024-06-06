import { IsUUID } from 'class-validator';

export class CreateInviteLinkDto {
  @IsUUID()
  clubId: string;
}
