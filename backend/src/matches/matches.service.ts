import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { ClubsService } from 'src/clubs/clubs.service';
import { UserClubService } from 'src/user-club/user-club.service';
import { ConfirmParticipationDto } from './dto/confirm-participation.dto';
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
    const club = await this.clubService.findOneByName(createMatchDto.clubName);
    if (!club) {
      throw new HttpException('Club not found', HttpStatus.NOT_FOUND);
    }

    const newMatch = this.matchRepository.create({
      club,
      date: createMatchDto.date,
      location: createMatchDto.location,
      confirmedUsers: [],
      teamA: [],
      teamB: [],
      goalsTeamA: [],
      goalsTeamB: [],
      playerPositions: [],
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

    console.log('match', match.club.id);
    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }

    const userClub = await this.userClubService.findUserClubByUserIdAndClubId(
      userId,
      match.club.id,
    );

    console.log('userClub', userClub);

    if (!userClub) {
      throw new HttpException('Not a member of the club', HttpStatus.FORBIDDEN);
    }

    console.log('confirmParticipationDto', confirmParticipationDto);

    match.confirmedUsers.push(userClub.user);

    console.log('match', match);

    match.playerPositions.push({
      userId,
      userName: userClub.user.username,
      position: confirmParticipationDto.position,
    });

    console.log('match', match);

    return this.matchRepository.save(match);
  }

  async divideTeams(matchId: string): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['confirmedUsers'],
    });
    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }

    const confirmedUsers = match.confirmedUsers;
    const halfSize = Math.ceil(confirmedUsers.length / 2);

    match.teamA = confirmedUsers.slice(0, halfSize);
    match.teamB = confirmedUsers.slice(halfSize);

    return this.matchRepository.save(match);
  }

  async recordGoal({
    matchId,
    team,
    userId,
  }: {
    matchId: string;
    userId: string;
    team: 'A' | 'B';
  }): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['teamA', 'teamB'],
    });
    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }

    if (team === 'A') {
      if (!match.teamA.some((user) => user.id === userId)) {
        throw new HttpException('User not in Team A', HttpStatus.BAD_REQUEST);
      }
      match.goalsTeamA.push(userId);
    } else {
      if (!match.teamB.some((user) => user.id === userId)) {
        throw new HttpException('User not in Team B', HttpStatus.BAD_REQUEST);
      }
      match.goalsTeamB.push(userId);
    }

    return this.matchRepository.save(match);
  }

  async findOne(id: string): Promise<Match> {
    return this.matchRepository.findOne({
      where: { id },
      relations: ['confirmedUsers', 'teamA', 'teamB', 'ratings'],
    });
  }

  async findUpcomingMatchesForUser(userId: string): Promise<Match[]> {
    const userClubs = await this.userClubService.findClubsByUserId(userId);
    const clubIds = userClubs.map((userClub) => userClub.club.id);

    const upcomingMatches = await this.matchRepository.find({
      where: {
        club: { id: In(clubIds) },
        date: MoreThan(new Date().toISOString()),
      },
      relations: ['club'],
    });

    return upcomingMatches;
  }
}
