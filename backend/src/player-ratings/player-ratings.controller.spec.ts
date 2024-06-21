import { Test, TestingModule } from '@nestjs/testing';
import { PlayerRatingsController } from './player-ratings.controller';
import { PlayerRatingsService } from './player-ratings.service';

describe('PlayerRatingsController', () => {
  let controller: PlayerRatingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerRatingsController],
      providers: [PlayerRatingsService],
    }).compile();

    controller = module.get<PlayerRatingsController>(PlayerRatingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
