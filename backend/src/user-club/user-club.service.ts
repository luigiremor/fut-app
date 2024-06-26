import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateUserClubDto } from './dto/create-user-club.dto';
import { UpdateUserClubDto } from './dto/update-user-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserClub, UserRole } from './entities/user-club.entity';
import { UserService } from 'src/user/user.service';
import { ClubsService } from 'src/clubs/clubs.service';

@Injectable()
export class UserClubService {
  constructor(
    @InjectRepository(UserClub)
    private userClubRepository: Repository<UserClub>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ClubsService))
    private clubService: ClubsService,
  ) {}

  async create(createUserClubDto: CreateUserClubDto) {
    const user = await this.userService.findUserById(createUserClubDto.userId);
    const club = await this.clubService.findOne(createUserClubDto.clubId);

    if (!user || !club) {
      throw new Error('User or Club not found');
    }

    const newUserClub = this.userClubRepository.create({
      ...createUserClubDto,
      user,
      club,
    });

    return this.userClubRepository.save(newUserClub);
  }

  findAll() {
    return this.userClubRepository.find({ relations: ['user', 'club'] });
  }

  findOne(id: string) {
    return this.userClubRepository.findOne({
      where: { id },
      relations: ['user', 'club'],
    });
  }

  async update(id: string, updateUserClubDto: UpdateUserClubDto) {
    const userClub = await this.userClubRepository.findOne({
      where: { id },
      relations: ['user', 'club'],
    });

    if (!userClub) {
      throw new HttpException('UserClub not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserClubDto.clubId) {
      const club = await this.clubService.findOne(updateUserClubDto.clubId);
      if (!club) {
        throw new HttpException('Club not found', HttpStatus.NOT_FOUND);
      }
      userClub.club = club;
    }

    if (updateUserClubDto.userId) {
      const user = await this.userService.findUserById(
        updateUserClubDto.userId,
      );
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      userClub.user = user;
    }

    if (updateUserClubDto.role) {
      userClub.role = updateUserClubDto.role;
    }

    return this.userClubRepository.save(userClub);
  }

  remove(id: string) {
    return this.userClubRepository.delete(id);
  }

  async hasUserAdminPermissionByClubId(
    userId: string,
    clubId: string,
  ): Promise<boolean> {
    const userClub = await this.userClubRepository.findOne({
      where: {
        user: { id: userId },
        club: { id: clubId },
        role: In([UserRole.OWNER, UserRole.ADMIN]),
      },
    });
    return !!userClub;
  }

  async findUserClubByUserIdAndClubId(
    userId: string,
    clubId: string,
  ): Promise<UserClub> {
    const userClub = await this.userClubRepository.findOne({
      where: { user: { id: userId }, club: { id: clubId } },
      relations: ['user', 'club'],
    });

    return userClub;
  }

  async getUsersWithRolesForClubByName(clubName: string, userId: string) {
    const club = await this.clubService.findOneByName(clubName);

    if (!club) {
      throw new HttpException('Club not found', HttpStatus.NOT_FOUND);
    }

    const currentUserClub = await this.userClubRepository.findOne({
      where: {
        user: { id: userId },
        club: { id: club.id },
      },
    });

    if (!currentUserClub) {
      throw new HttpException(
        'You do not have permission to view users for this club',
        HttpStatus.FORBIDDEN,
      );
    }

    const usersWithRoles = await this.userClubRepository.find({
      where: { club: { id: club.id } },
      relations: ['user', 'club'],
    });

    return usersWithRoles;
  }

  async findClubsByUserId(userId: string): Promise<UserClub[]> {
    return this.userClubRepository.find({
      where: { user: { id: userId } },
      relations: ['club'],
    });
  }
}
