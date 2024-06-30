import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { ClubsService } from 'src/clubs/clubs.service';
import { UserClubService } from 'src/user-club/user-club.service';
import { ConfirmParticipationDto } from './dto/confirm-participation.dto';
import { Match } from './entities/match.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private clubService: ClubsService,
    private userService: UserService,
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
      relations: ['confirmedUsers', 'teamA', 'teamB'],
    });
    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }

    const confirmedUsers = match.confirmedUsers;
    const playerPositions = match.playerPositions;

    // Calculate average rating for a player
    const calculateAverageRating = (ratings) => {
      if (ratings.length === 0) return 0;
      const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      return sum / ratings.length;
    };

    // Get average ratings for each confirmed player
    const players = await Promise.all(
      confirmedUsers.map(async (user) => {
        const positionData = playerPositions.find((p) => p.userId === user.id);
        const userWithRatings = await this.userService.findOne({
          userId: user.id,
        });

        return {
          ...user,
          position: positionData ? positionData.position : 'UNKNOWN',
          rating: calculateAverageRating(userWithRatings.receivedRatings),
        };
      }),
    );

    console.log('players', players);

    // Segrage players by position
    const positions = ['GK', 'DEF', 'MID', 'FWD'];
    const positionGroups = positions.reduce((acc, position) => {
      acc[position] = players.filter((player) => player.position === position);
      return acc;
    }, {});

    // Distribute players to balance teams
    const distributePlayers = (players) => {
      const teamA = [];
      const teamB = [];
      let sumA = 0;
      let sumB = 0;

      players.sort((a, b) => b.rating - a.rating); // Order players by rating

      players.forEach((player) => {
        if (
          teamA.length < teamB.length ||
          (teamA.length === teamB.length && sumA <= sumB)
        ) {
          teamA.push(player);
          sumA += player.rating;
        } else {
          teamB.push(player);
          sumB += player.rating;
        }
      });

      return { teamA, teamB };
    };

    // Distribute players in each position group
    let teamA = [];
    let teamB = [];
    positions.forEach((position) => {
      const { teamA: positionTeamA, teamB: positionTeamB } = distributePlayers(
        positionGroups[position],
      );
      teamA = [...teamA, ...positionTeamA];
      teamB = [...teamB, ...positionTeamB];
    });

    // Ensure teams have the same number of players
    while (teamA.length > teamB.length) {
      teamB.push(teamA.pop());
    }
    while (teamB.length > teamA.length) {
      teamA.push(teamB.pop());
    }

    match.teamA = teamA;
    match.teamB = teamB;

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

  async deleteGoal({
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
      const userGoals = match.goalsTeamA;
      const userGoalIndex = userGoals.lastIndexOf(userId);
      if (userGoalIndex === -1) {
        throw new HttpException(
          'User has not scored any goals',
          HttpStatus.BAD_REQUEST,
        );
      }
      match.goalsTeamA.splice(userGoalIndex, 1);
    } else {
      const userGoals = match.goalsTeamB;
      const userGoalIndex = userGoals.lastIndexOf(userId);
      if (userGoalIndex === -1) {
        throw new HttpException(
          'User has not scored any goals',
          HttpStatus.BAD_REQUEST,
        );
      }
      match.goalsTeamB.splice(userGoalIndex, 1);
    }

    return this.matchRepository.save(match);
  }

  async findOne(id: string): Promise<Match> {
    return this.matchRepository.findOne({
      where: { id },
      relations: [
        'confirmedUsers',
        'teamA',
        'teamB',
        'teamA.receivedRatings',
        'teamA.receivedRatings.reviewer',
        'teamA.receivedRatings.match',
        'teamB.receivedRatings',
        'teamB.receivedRatings.reviewer',
        'teamB.receivedRatings.match',
        'ratings',
        'ratings.reviewer',
        'ratings.reviewee',
      ],
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
      relations: ['club', 'confirmedUsers'],
    });

    return upcomingMatches;
  }

  async findUpcomingMatchesForClub(clubName: string): Promise<Match[]> {
    return this.matchRepository.find({
      where: {
        club: { name: clubName },
        date: MoreThan(new Date().toISOString()),
      },
      relations: ['club', 'confirmedUsers'],
    });
  }

  async findPastMatchesForUser(userId: string): Promise<Match[]> {
    return this.matchRepository.find({
      where: {
        confirmedUsers: { id: userId },
        date: LessThan(new Date().toISOString()),
      },
      relations: ['club', 'confirmedUsers'],
    });
  }
}
