import { PartialType } from '@nestjs/swagger';
import { CreateUserClubDto } from './create-user-club.dto';

export class UpdateUserClubDto extends PartialType(CreateUserClubDto) {}
