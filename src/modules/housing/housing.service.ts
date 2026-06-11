import { Injectable } from '@nestjs/common';
import { CreateHousingDto } from './dto/create-housing.dto';
import { UpdateHousingDto } from './dto/update-housing.dto';

@Injectable()
export class HousingService {
  create(createHousingDto: CreateHousingDto) {
    return 'This action adds a new housing';
  }

  findAll() {
    return `This action returns all housing`;
  }

  findOne(id: number) {
    return `This action returns a #${id} housing`;
  }

  update(id: number, updateHousingDto: UpdateHousingDto) {
    return `This action updates a #${id} housing`;
  }

  remove(id: number) {
    return `This action removes a #${id} housing`;
  }
}
