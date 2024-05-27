import { Test, TestingModule } from '@nestjs/testing';
import { UserClubService } from './user-club.service';

describe('UserClubService', () => {
  let service: UserClubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserClubService],
    }).compile();

    service = module.get<UserClubService>(UserClubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
