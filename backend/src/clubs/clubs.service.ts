import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserClubDto } from 'src/user-club/dto/create-user-club.dto';
import { UserClubService } from 'src/user-club/user-club.service';
import { UserClub, UserRole } from 'src/user-club/entities/user-club.entity';
import { InviteClubDto } from './dto/invite-club.dto';
import { InviteToken } from './entities/invite-token.entity';
import * as crypto from 'crypto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ClubsService {
  constructor(
    private userClubService: UserClubService,
    private userService: UserService,
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
    @InjectRepository(InviteToken)
    private inviteTokenRepository: Repository<InviteToken>,
  ) {}

  async create(createClubDto: CreateClubDto, userId: string) {
    const newClub = this.clubRepository.create(createClubDto);
    const savedClub = await this.clubRepository.save(newClub);

    const createUserClubDto: CreateUserClubDto = {
      userId,
      clubId: savedClub.id,
      role: UserRole.OWNER,
    };

    const newUserClub = await this.userClubService.create(createUserClubDto);
    return savedClub;
  }

  findAll() {
    return this.clubRepository.find();
  }

  findOne(id: string) {
    return this.clubRepository.findOne({ where: { id } });
  }

  findOneByName(name: string) {
    return this.clubRepository.findOne({
      where: { name },
      relations: ['userClubs', 'matches'],
    });
  }

  async findClubsByUser(userId: string): Promise<Club[]> {
    return this.clubRepository
      .createQueryBuilder('club')
      .innerJoinAndSelect(
        'club.userClubs',
        'userClub',
        'userClub.userId = :userId',
        { userId },
      )
      .leftJoinAndSelect('club.userClubs', 'allUserClubs')
      .leftJoinAndSelect('allUserClubs.user', 'user')
      .getMany();
  }

  updateByName(name: string, updateClubDto: UpdateClubDto) {
    return this.clubRepository.update({ name }, updateClubDto);
  }

  removeByName(name: string) {
    return this.clubRepository.delete({ name });
  }

  async generateInviteLink(clubName: string): Promise<string> {
    const club = await this.clubRepository.findOne({
      where: { name: clubName },
    });

    const inviteToken = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const newInviteToken = this.inviteTokenRepository.create({
      token: inviteToken,
      club: { id: club.id },
      expiresAt,
    });

    await this.inviteTokenRepository.save(newInviteToken);

    return `${process.env.FRONTEND_DOMAIN}/join?clubName=${clubName}&inviteToken=${inviteToken}`;
  }

  async joinClub(
    inviteClubDto: InviteClubDto,
    userId: string,
  ): Promise<UserClub> {
    const inviteToken = await this.inviteTokenRepository.findOne({
      where: {
        token: inviteClubDto.inviteToken,
        club: { name: inviteClubDto.clubName },
      },
      relations: ['club'],
    });

    if (!inviteToken || new Date() > inviteToken.expiresAt) {
      throw new HttpException(
        'Invalid or expired invite token',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createUserClubDto: CreateUserClubDto = {
      userId,
      clubId: inviteToken.club.id,
      role: UserRole.MEMBER,
    };

    await this.inviteTokenRepository.remove(inviteToken);

    return this.userClubService.create(createUserClubDto);
  }

  async getMostActiveUsers(clubName: string) {
    const club = await this.clubRepository.findOne({
      where: { name: clubName },
      relations: ['matches', 'matches.teamA', 'matches.teamB'],
    });

    const players = club.matches
      .map((match) => [...match.teamA, ...match.teamB])
      .flat();

    const playerCount: Record<string, number> = players.reduce(
      (acc, player) => {
        acc[player.id] = (acc[player.id] || 0) + 1;
        return acc;
      },
      {},
    );

    const sortedPlayers = Object.entries(playerCount).sort(
      ([, a], [, b]) => b - a,
    );

    const topPlayers = sortedPlayers.slice(0, 3);

    const topPlayersWithUser = await Promise.all(
      topPlayers.map(async ([userId, count]) => {
        const user = await this.userService.findOne({ userId });
        return { user, count };
      }),
    );

    return topPlayersWithUser;
  }

  async getMostRankedUsers(clubName: string) {
    const club = await this.clubRepository.findOne({
      where: { name: clubName },
      relations: ['matches', 'matches.teamA', 'matches.teamB'],
    });

    const players = club.matches
      .map((match) => [...match.teamA, ...match.teamB])
      .flat();

    const playerRatings: Record<
      string,
      { totalRating: number; ratingCount: number }
    > = {};

    for (const player of players) {
      const userWithRatings = await this.userService.findOne({
        userId: player.id,
      });

      if (!userWithRatings) continue;

      for (const rating of userWithRatings.receivedRatings) {
        if (!playerRatings[player.id]) {
          playerRatings[player.id] = { totalRating: 0, ratingCount: 0 };
        }

        playerRatings[player.id].totalRating += rating.rating;
        playerRatings[player.id].ratingCount += 1;
      }
    }

    const playerAverages = Object.entries(playerRatings).map(
      ([userId, { totalRating, ratingCount }]) => {
        return { userId, averageRating: totalRating / ratingCount };
      },
    );

    const sortedPlayers = playerAverages.sort(
      (a, b) => b.averageRating - a.averageRating,
    );
    const topPlayers = sortedPlayers.slice(0, 3);

    const topPlayersWithUser = await Promise.all(
      topPlayers.map(async ({ userId, averageRating }) => {
        const user = await this.userService.findOne({ userId });
        return { user, averageRating };
      }),
    );

    return topPlayersWithUser;
  }
}
