import { IsString, IsUUID } from 'class-validator';

export class CreateMatchDto {
  @IsUUID()
  clubId: string;

  @IsString()
  date: string;

  @IsString()
  location: string;
}
