import { IsString, IsUUID, IsIn } from 'class-validator';

export class CreateUserClubDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  clubId: string;

  @IsString()
  @IsIn(['admin', 'member'])
  role: string;
}
