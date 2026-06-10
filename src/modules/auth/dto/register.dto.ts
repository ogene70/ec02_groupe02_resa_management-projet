import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: "L'adresse email doit être valide." })
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Le nom est requis.' })
    nom: string;

    @IsString()
    @IsNotEmpty({ message: 'Le prénom est requis.' })
    prenom: string;

    @IsString()
    @IsNotEmpty({ message: 'Le nom de votre société/gîte est requis.' })
    tenantName: string; // Utilisé pour créer le Tenant associé
}
