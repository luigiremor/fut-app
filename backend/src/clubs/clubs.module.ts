import { Module, forwardRef } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from './entities/club.entity';
import { UserClubModule } from 'src/user-club/user-club.module';
import { UserClub } from 'src/user-club/entities/user-club.entity';
import { AuthModule } from 'src/auth/auth.module';
import { InviteToken } from './entities/invite-token.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club, UserClub, InviteToken]),
    UserClubModule,
    UserModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}
