import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerRatingsService } from './player-ratings.service';
import { PlayerRatingsController } from './player-ratings.controller';
import { PlayerRating } from './entities/player-rating.entity';
import { MatchModule } from '../matches/matches.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerRating]),
    MatchModule,
    UserModule,
    forwardRef(() => AuthModule),
  ],
  providers: [PlayerRatingsService],
  controllers: [PlayerRatingsController],
})
export class PlayerRatingsModule {}
