import { Injectable } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserClubDto } from 'src/user-club/dto/create-user-club.dto';
import { UserClubService } from 'src/user-club/user-club.service';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
    private userClubService: UserClubService,
  ) {}

  async create(createClubDto: CreateClubDto, userId: string) {
    const newClub = this.clubRepository.create(createClubDto);

    const savedClub = await this.clubRepository.save(newClub);

    const createUserClubDto: CreateUserClubDto = {
      userId,
      clubId: savedClub.id,
      role: 'admin',
    };

    const newUserClub = this.userClubService.create(createUserClubDto);

    return savedClub;
  }

  findAll() {
    return this.clubRepository.find();
  }

  findOne(id: string) {
    return this.clubRepository.findOne({ where: { id } });
  }

  update(id: string, updateClubDto: UpdateClubDto) {
    return this.clubRepository.update(id, updateClubDto);
  }

  remove(id: string) {
    return this.clubRepository.delete(id);
  }
}
