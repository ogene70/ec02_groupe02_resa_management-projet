import { ApiProperty } from '@nestjs/swagger';
import { User, RoleUser } from '@prisma/client';

export class UserEntity implements Partial<User> {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
    tenant_id: string;

    @ApiProperty({ example: 'Dupont' })
    nom: string;

    @ApiProperty({ example: 'Jean' })
    prenom: string;

    @ApiProperty({ example: 'jean.dupont@gites.fr' })
    email: string;

    @ApiProperty({ enum: RoleUser, example: RoleUser.gestionnaire })
    role: RoleUser;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    // On n'inclut délibérément PAS password_hash ici pour qu'il ne fuite jamais vers le Frontend !

    // Le constructeur permet d'assigner les données de la base à l'entité de manière propre
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
