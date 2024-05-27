import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserClubDto } from './dto/create-user-club.dto';
import { UpdateUserClubDto } from './dto/update-user-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserClub } from './entities/user-club.entity';
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

    console.log('newUserClub', newUserClub);

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

  update(id: string, updateUserClubDto: UpdateUserClubDto) {
    return this.userClubRepository.update(id, updateUserClubDto);
  }

  remove(id: number) {
    return this.userClubRepository.delete(id);
  }
}
