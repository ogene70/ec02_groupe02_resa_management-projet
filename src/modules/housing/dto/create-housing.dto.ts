import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsObject, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatutLogement } from '@prisma/client';

export class CreateHousingDto {
    @ApiProperty({ example: 'Appartement lumineux en centre-ville' })
    @IsString()
    @IsNotEmpty()
    titre: string;

    @ApiPropertyOptional({ example: 'Proche de toutes les commodités...' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1, { message: "La capacité doit être d'au moins 1 personne." })
    capacite: number;

    @ApiProperty({ example: '10 rue de la Paix' })
    @IsString()
    @IsNotEmpty()
    adresse: string;

    @ApiProperty({ example: 'Paris' })
    @IsString()
    @IsNotEmpty()
    ville: string;

    @ApiProperty({ example: '75001' })
    @IsString()
    @IsNotEmpty()
    code_postal: string;

    @ApiPropertyOptional({ example: { wifi: true, tv: true } })
    @IsObject()
    @IsOptional()
    equipements?: Record<string, unknown>;

    @ApiPropertyOptional({ example: { non_fumeur: true } })
    @IsObject()
    @IsOptional()
    regles?: Record<string, unknown>;

    @ApiPropertyOptional({ enum: StatutLogement, default: StatutLogement.actif })
    @IsEnum(StatutLogement)
    @IsOptional()
    statut?: StatutLogement;
}
