import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './matches.service';
import { MatchController } from './matches.controller';
import { ClubsModule } from 'src/clubs/clubs.module';
import { Match } from './entities/match.entity';
import { UserClubModule } from 'src/user-club/user-club.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    ClubsModule,
    UserClubModule,
    forwardRef(() => AuthModule),
  ],
  providers: [MatchService],
  controllers: [MatchController],
  exports: [MatchService],
})
export class MatchModule {}
