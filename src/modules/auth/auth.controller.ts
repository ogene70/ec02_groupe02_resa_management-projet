import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@ApiTags('Authentification') // Regroupe les endpoints dans Swagger UI sous "Authentification"
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService, // On injecte le service pour récupérer les infos complètes
    ) {}

    @Post('register')
    @ApiOperation({ summary: "Création d'un compte gestionnaire et de son espace (Tenant)" })
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: "Connexion de l'utilisateur" })
    @HttpCode(HttpStatus.OK) // [NOTE FRONTEND] : Override car NestJS renvoie 201 par défaut sur les POST
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth() // Permet de préciser à Swagger que cet endpoint requiert un JWT
    @ApiOperation({ summary: "Déconnexion de l'utilisateur" })
    @HttpCode(HttpStatus.OK)
    logout() {
        // Attention, Résa utilise des JSON Web Tokens (stateless).
        // Le serveur ne "détruit" pas la session en base de données.
        // C'est au frontend de supprimer le token stocké (localStorage/cookies) !
        return {
            message: 'Déconnexion réussie. Veuillez supprimer le token côté client.',
        };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Récupérer le profil complet de l'utilisateur connecté" })
    getProfile(@Request() req: any) {
        // On utilise le payload validé par la JwtStrategy pour extraire l'ID.
        // Ensuite, on interroge la base via UsersService pour renvoyer un profil à jour.

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        return this.usersService.findOne(req.user.id);
    }
}
