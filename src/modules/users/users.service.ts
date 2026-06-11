import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Créer un nouvel utilisateur au sein d'un Tenant spécifique
     */
    async create(createUserDto: CreateUserDto, tenantId: string): Promise<UserEntity> {
        const { email, password, nom, prenom, role } = createUserDto;

        const userExists = await this.prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new ConflictException('Un utilisateur avec cet email existe déjà.');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                password_hash: passwordHash,
                nom,
                prenom,
                role: role || 'gestionnaire',
                tenant_id: tenantId,
            },
        });

        return new UserEntity(this.excludePassword(user));
    }

    /**
     * Récupère tous les utilisateurs d'un Tenant
     */
    async findAll(tenantId: string): Promise<UserEntity[]> {
        const users = await this.prisma.user.findMany({
            where: { tenant_id: tenantId },
        });

        return users.map((user) => new UserEntity(this.excludePassword(user)));
    }

    /**
     * Récupère un utilisateur par son ID (le mot de passe sera masqué)
     */
    async findOne(id: string): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('Utilisateur introuvable');
        }

        return new UserEntity(this.excludePassword(user));
    }

    /**
     * Met à jour un utilisateur
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        // Vérifier si l'utilisateur existe
        await this.findOne(id);

        const { password, ...rest } = updateUserDto;

        // Utilisation du type natif de Prisma pour s'assurer qu'on ne passe pas de données invalides
        const dataToUpdate: Prisma.UserUpdateInput = { ...rest };

        // Si le mot de passe est mis à jour, on doit le re-hasher
        if (password) {
            dataToUpdate.password_hash = await bcrypt.hash(password, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: dataToUpdate,
        });

        return new UserEntity(this.excludePassword(updatedUser));
    }

    /**
     * Supprime un utilisateur
     */
    async remove(id: string) {
        // Vérifier si l'utilisateur existe
        await this.findOne(id);

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: 'Utilisateur supprimé avec succès.' };
    }

    /**
     * Méthode utilitaire pour retirer le mot de passe de l'objet retourné.
     * On utilise "Omit" pour définir le type de retour, et un underscore (_)
     * pour ignorer la variable de destructuration afin d'éviter l'erreur ESLint "no-unused-vars".
     */
    private excludePassword(user: User): Omit<User, 'password_hash'> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
