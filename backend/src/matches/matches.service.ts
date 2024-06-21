import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubsService } from 'src/clubs/clubs.service';
import { UserClubService } from 'src/user-club/user-club.service';
import { ConfirmParticipationDto } from './dto/confirm-participation';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private clubService: ClubsService,
    private userClubService: UserClubService,
  ) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const club = await this.clubService.findOne(createMatchDto.clubId);
    if (!club) {
      throw new HttpException('Club not found', HttpStatus.NOT_FOUND);
    }

    const newMatch = this.matchRepository.create({
      club,
      date: createMatchDto.date,
      location: createMatchDto.location,
      confirmedUsers: [],
      goals: [],
      assists: [],
    });

    return this.matchRepository.save(newMatch);
  }

  async confirmParticipation(
    userId: string,
    confirmParticipationDto: ConfirmParticipationDto,
  ): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id: confirmParticipationDto.matchId },
      relations: ['confirmedUsers', 'club'],
    });
    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }

    const userClub = await this.userClubService.findUserClubByUserIdAndClubId(
      userId,
      match.club.id,
    );
    if (!userClub) {
      throw new HttpException('Not a member of the club', HttpStatus.FORBIDDEN);
    }

    match.confirmedUsers.push(userClub.user);
    return this.matchRepository.save(match);
  }

  async findOne(id: string, options?: any): Promise<Match> {
    return this.matchRepository.findOne({
      where: { id },
      ...options,
    });
  }
}
