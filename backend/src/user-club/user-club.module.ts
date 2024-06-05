import { Module, forwardRef } from '@nestjs/common';
import { UserClubService } from './user-club.service';
import { UserClubController } from './user-club.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserClub } from './entities/user-club.entity';
import { UserModule } from 'src/user/user.module';
import { ClubsModule } from 'src/clubs/clubs.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserClub]),
    forwardRef(() => UserModule),
    forwardRef(() => ClubsModule),
    AuthModule,
  ],
  controllers: [UserClubController],
  providers: [UserClubService],
  exports: [UserClubService],
})
export class UserClubModule {}
