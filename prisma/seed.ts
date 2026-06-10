// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Hasher les mots de passe
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Créer des utilisateurs
    const tenant = await prisma.user.upsert({
        where: { email: 'tenant@example.com' },
        update: {},
        create: {
            email: 'tenant@example.com',
            password_hash: hashedPassword,
            nom: 'Dupont',
            prenom: 'Jean',
            role: 'TENANT',
            telephone: '+33123456789',
        },
    });

    const voyageur = await prisma.user.upsert({
        where: { email: 'voyageur@example.com' },
        update: {},
        create: {
            email: 'voyageur@example.com',
            password_hash: hashedPassword,
            nom: 'Martin',
            prenom: 'Pierre',
            role: 'VOYAGEUR',
            telephone: '+33987654321',
        },
    });

    console.log('Seed terminé :', { tenant, voyageur });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
