import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Logement, StatutLogement } from '@prisma/client';

export class HousingEntity implements Logement {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174011' })
    id: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
    tenant_id: string;

    @ApiProperty({ example: 'Chalet romantique avec vue' })
    titre: string;

    @ApiPropertyOptional({ example: 'Un magnifique chalet isolé dans la montagne...' })
    description: string | null;

    @ApiProperty({ example: 4, description: "Capacité d'accueil en nombre de personnes" })
    capacite: number;

    @ApiProperty({ example: '12 Chemin des Écureuils' })
    adresse: string;

    @ApiProperty({ example: 'Montagne-Secrète' })
    ville: string;

    @ApiProperty({ example: '81000' })
    code_postal: string;

    @ApiPropertyOptional({ example: { wifi: true, piscine: false, parking: true } })
    equipements: any | null; // Typé génériquement en "any" par Prisma pour le JSON

    @ApiPropertyOptional({ example: { animaux_acceptes: false, fete_autorisee: false } })
    regles: any | null;

    @ApiProperty({ enum: StatutLogement, example: StatutLogement.actif })
    statut: StatutLogement;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    constructor(partial: Partial<HousingEntity>) {
        Object.assign(this, partial);
    }
}
