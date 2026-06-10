import { Injectable, ConflictException } from '@nestjs/common';
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

    async login(loginDto: LoginDto): Promise<{ access_token: string; user: Omit<User, 'password_hash'> }> {
        // Trouver l'utilisateur
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });
        if (!user) {
            throw new UnauthorizedException('Email ou mot de passe incorrect.');
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email ou mot de passe incorrect.');
        }

        // Générer le payload JWT
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        // Générer le token
        const access_token = this.jwtService.sign(payload);

        // Retourner le token et les infos utilisateur (sans le hash)
        const { password_hash, ...userWithoutHash } = user;
        return {
            access_token,
            user: userWithoutHash,
        };
    }

    async register(registerDto: RegisterDto): Promise<Omit<User, 'password_hash'>> {
        // Vérifier si l'email existe déjà
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new ConflictException('Un utilisateur avec cet email existe déjà.');
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Créer l'utilisateur
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password_hash: hashedPassword,
                nom: registerDto.nom,
                prenom: registerDto.prenom,
                telephone: registerDto.telephone,
            },
            select: {
                id: true,
                email: true,
                nom: true,
                prenom: true,
                telephone: true,
                role: true,
                statut: true,
                created_at: true,
                updated_at: true,
            },
        });

        return user;
    }
}
