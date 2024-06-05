import { IsString, IsUUID, IsIn } from 'class-validator';
import { UserRole } from '../entities/user-club.entity';

export class CreateUserClubDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  clubId: string;

  @IsString()
  @IsIn([UserRole.ADMIN, UserRole.OWNER, UserRole.MEMBER])
  role: string;
}
