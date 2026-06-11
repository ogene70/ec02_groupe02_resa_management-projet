import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HousingService } from './housing.service';
import { CreateHousingDto } from './dto/create-housing.dto';
import { UpdateHousingDto } from './dto/update-housing.dto';

@Controller('housing')
export class HousingController {
  constructor(private readonly housingService: HousingService) {}

  @Post()
  create(@Body() createHousingDto: CreateHousingDto) {
    return this.housingService.create(createHousingDto);
  }

  @Get()
  findAll() {
    return this.housingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.housingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHousingDto: UpdateHousingDto) {
    return this.housingService.update(+id, updateHousingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.housingService.remove(+id);
  }
}
