import { IsDate, IsString } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  clubName: string;

  @IsDate()
  date: string;

  @IsString()
  location: string;
}
