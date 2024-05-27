import { Test, TestingModule } from '@nestjs/testing';
import { UserClubController } from './user-club.controller';
import { UserClubService } from './user-club.service';

describe('UserClubController', () => {
  let controller: UserClubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserClubController],
      providers: [UserClubService],
    }).compile();

    controller = module.get<UserClubController>(UserClubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
