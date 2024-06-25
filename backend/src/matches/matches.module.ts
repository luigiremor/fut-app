import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './matches.service';
import { MatchController } from './matches.controller';
import { ClubsModule } from 'src/clubs/clubs.module';
import { Match } from './entities/match.entity';
import { UserClubModule } from 'src/user-club/user-club.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    ClubsModule,
    UserClubModule,
    UserModule,
    forwardRef(() => AuthModule),
  ],
  providers: [MatchService],
  controllers: [MatchController],
  exports: [MatchService],
})
export class MatchModule {}
