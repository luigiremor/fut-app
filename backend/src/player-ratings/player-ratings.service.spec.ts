import { Test, TestingModule } from '@nestjs/testing';
import { PlayerRatingsService } from './player-ratings.service';

describe('PlayerRatingsService', () => {
  let service: PlayerRatingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerRatingsService],
    }).compile();

    service = module.get<PlayerRatingsService>(PlayerRatingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
