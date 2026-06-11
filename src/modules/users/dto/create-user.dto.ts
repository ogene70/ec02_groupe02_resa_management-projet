import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleUser } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty({ example: 'nouveau.collegue@gites.fr' })
    @IsEmail({}, { message: "L'adresse email doit être valide." })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'MotDePasseSécurisé123!' })
    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'Martin' })
    @IsString()
    @IsNotEmpty()
    nom: string;

    @ApiProperty({ example: 'Paul' })
    @IsString()
    @IsNotEmpty()
    prenom: string;

    @ApiPropertyOptional({ enum: RoleUser, default: RoleUser.gestionnaire })
    @IsEnum(RoleUser)
    @IsOptional()
    role?: RoleUser;
}
