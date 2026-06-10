import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';

/**
 * Ce service Prisma personnalisé utilise un Pool de connexion PostgreSQL natif
 * pour gérer les connexions de manière efficace, tout en bénéficiant de l'ORM Prisma.
 *
 * Avantages :
 * - Meilleure gestion des connexions grâce au Pool natif
 * - Intégration transparente avec Prisma via l'adaptateur PrismaPg
 * - Facilité d'utilisation dans les services NestJS
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(private configService: ConfigService) {
        // 1. On crée un Pool de connexion PostgreSQL natif
        const connectionString = configService.get<string>('DATABASE_URL');
        const pool = new Pool({ connectionString });

        // 2. On l'enveloppe dans l'adaptateur Prisma
        const adapter = new PrismaPg(pool);

        // 3. On passe l'adaptateur au client Prisma
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
