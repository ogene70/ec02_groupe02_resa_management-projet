import { HousingController } from './housing.controller';
import { HousingService } from './housing.service';
import { Module } from '@nestjs/common';

@Module({
    controllers: [HousingController],
    providers: [HousingService],
    exports: [HousingService], // Utile si on veut utiliser les requêtes de logements dans le module de Réservation !
})
export class HousingModule {}
