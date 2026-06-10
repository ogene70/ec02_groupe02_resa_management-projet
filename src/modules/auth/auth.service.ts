import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const { email, password, nom, prenom, tenantName } = registerDto;

        const userExists = await this.prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new ConflictException('Un utilisateur avec cet email existe déjà.');
        }

        // 10 tours (salt rounds) est un bon compromis sécurité/performance.
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        try {
            // L'utilisation d'une transaction Prisma ($transaction) est OBLIGATOIRE ici.
            // Si on crée le Tenant, mais que la création du User échoue (ex: perte réseau),
            // tout est annulé automatiquement. Cela évite d'avoir des "sociétés fantômes" sans gestionnaire.
            const newUser = await this.prisma.$transaction(async (prisma) => {
                const tenant = await prisma.tenant.create({
                    data: {
                        nom: tenantName,
                        email_contact: email,
                    },
                });

                return prisma.user.create({
                    data: {
                        email,
                        password_hash: passwordHash,
                        nom,
                        prenom,
                        tenant_id: tenant.id,
                        role: 'gestionnaire',
                    },
                });
            });

            return this.generateToken(newUser);
        } catch (error) {
            throw new InternalServerErrorException('Erreur lors de la création du compte.', { cause: error });
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Identifiants invalides.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Identifiants invalides.');
        }

        return this.generateToken(user);
    }

    private generateToken(user: User) {
        // Le payload JWT contient des données non-sensibles.
        // L'ajout du 'tenantId' ici va nous permettre de sécuriser facilement toutes les autres routes API
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenant_id,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role,
                tenantId: user.tenant_id,
            },
        };
    }
}
