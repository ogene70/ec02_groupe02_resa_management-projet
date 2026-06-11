import { Test, TestingModule } from '@nestjs/testing';
import { HousingController } from './housing.controller';
import { HousingService } from './housing.service';

describe('HousingController', () => {
  let controller: HousingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousingController],
      providers: [HousingService],
    }).compile();

    controller = module.get<HousingController>(HousingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
