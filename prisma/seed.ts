import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

// Instanciation spécifique Prisma 7
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Début du seed...');

    const tenant = await prisma.tenant.create({
        data: {
            nom: 'Gîtes de la Vallée',
            email_contact: 'contact@gites-vallee.fr',
            telephone: '0563000000',
            domaine_autorise: 'gites-vallee.fr',
        },
    });
    console.log(`Tenant créé: ${tenant.nom}`);

    const passwordHash = await bcrypt.hash('password123!', 10);
    const user = await prisma.user.create({
        data: {
            tenant_id: tenant.id,
            nom: 'Dupont',
            prenom: 'Jean',
            email: 'admin@gites-vallee.fr',
            password_hash: passwordHash,
            role: 'gestionnaire',
        },
    });
    console.log(`User créé: ${user.email}`);

    const logement = await prisma.logement.create({
        data: {
            tenant_id: tenant.id,
            titre: 'Chalet romantique avec vue',
            capacite: 2,
            adresse: '12 Chemin des Écureuils',
            ville: 'Montagne-Secrète',
            code_postal: '81000',
        },
    });
    console.log(`Logement créé: ${logement.titre}`);

    console.log('Seed terminé avec succès !');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
