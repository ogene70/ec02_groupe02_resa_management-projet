import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

// [NOTE POUR L'ÉQUIPE] : Définition d'une interface pour typer notre Payload et éviter le 'any' interdit par ESLint
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    tenantId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prisma: PrismaService,
        configService: ConfigService, // On n'utilise pas le mot-clé "private" ni "readonly" ici pour pouvoir l'utiliser avant le super()
    ) {
        // On récupère le secret AVANT d'appeler super()
        const secret = configService.get<string>('JWT_SECRET');

        // On s'assure que le secret est défini, sinon on fait planter l'application explicitement
        if (!secret) {
            throw new Error(
                "La variable d'environnement JWT_SECRET n'est pas définie (ou ConfigModule n'est pas initialisé correctement dans AppModule).",
            );
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    // Utilisation de l'interface JwtPayload au lieu de "any"
    async validate(payload: JwtPayload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user) {
            throw new UnauthorizedException('Utilisateur introuvable ou supprimé.');
        }

        // [NOTE POUR L'ÉQUIPE BACKEND] :
        // Grâce à cette méthode, sur TOUTES les routes protégées par @UseGuards(JwtAuthGuard),
        // vous aurez accès aux infos ci-dessous via le paramètre @Req() req -> req.user
        // Pratique pour filtrer les Logements par tenantId automatiquement !
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            tenantId: payload.tenantId,
        };
    }
}
