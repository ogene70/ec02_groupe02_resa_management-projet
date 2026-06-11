import { Module } from '@nestjs/common';
import { HousingService } from './housing.service';
import { HousingController } from './housing.controller';

@Module({
  controllers: [HousingController],
  providers: [HousingService],
})
export class HousingModule {}
