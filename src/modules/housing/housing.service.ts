import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHousingDto } from './dto/create-housing.dto';
import { UpdateHousingDto } from './dto/update-housing.dto';
import { Prisma } from '@prisma/client';
import { HousingEntity } from './entities/housing.entity';

@Injectable()
export class HousingService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Crée un nouveau logement pour un Tenant spécifique
     */
    async create(createHousingDto: CreateHousingDto, tenantId: string): Promise<HousingEntity> {
        // On prépare la donnée avec le type strict de Prisma pour éviter l'erreur sur les JSON
        const data: Prisma.LogementUncheckedCreateInput = {
            ...createHousingDto,
            tenant_id: tenantId,
            // On "cast" les objets JSON en Prisma.InputJsonValue
            equipements: createHousingDto.equipements as Prisma.InputJsonValue,
            regles: createHousingDto.regles as Prisma.InputJsonValue,
        };

        const logement = await this.prisma.logement.create({ data });

        return new HousingEntity(logement);
    }

    /**
     * Récupère tous les logements appartenant à un Tenant
     */
    async findAll(tenantId: string): Promise<HousingEntity[]> {
        const logements = await this.prisma.logement.findMany({
            where: { tenant_id: tenantId },
            orderBy: { created_at: 'desc' }, // Trie par date de création décroissante
        });

        return logements.map((logement) => new HousingEntity(logement));
    }

    /**
     * Récupère un logement spécifique, en s'assurant qu'il appartient bien au Tenant
     */
    async findOne(id: string, tenantId: string): Promise<HousingEntity> {
        const logement = await this.prisma.logement.findUnique({
            where: {
                id, // Attention: on utilise la syntaxe prisma correcte pour composite ou vérification post-query
            },
        });

        // On vérifie que le logement existe ET qu'il appartient bien au bon tenant
        if (logement?.tenant_id !== tenantId) {
            throw new NotFoundException(`Le logement #${id} est introuvable ou vous n'y avez pas accès.`);
        }

        return new HousingEntity(logement);
    }

    /**
     * Met à jour un logement
     */
    async update(id: string, updateHousingDto: UpdateHousingDto, tenantId: string): Promise<HousingEntity> {
        // Vérifie d'abord si le logement existe et appartient au tenant (réutilise notre fonction sécurisée)
        await this.findOne(id, tenantId);

        // On prépare la donnée de mise à jour avec le type strict
        const dataToUpdate: Prisma.LogementUncheckedUpdateInput = {
            ...updateHousingDto,
            equipements: updateHousingDto.equipements === undefined ? undefined : (updateHousingDto.equipements as Prisma.InputJsonValue),
            regles: updateHousingDto.regles === undefined ? undefined : (updateHousingDto.regles as Prisma.InputJsonValue),
        };

        const logementMisAJour = await this.prisma.logement.update({
            where: { id },
            data: dataToUpdate,
        });

        return new HousingEntity(logementMisAJour);
    }

    /**
     * Supprime un logement
     */
    async remove(id: string, tenantId: string) {
        // Vérifie les droits avant suppression
        await this.findOne(id, tenantId);

        await this.prisma.logement.delete({
            where: { id },
        });

        return { message: 'Logement supprimé avec succès.' };
    }
}
