import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Utilisateurs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Protection par JWT par défaut sur toutes les routes Users
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Créer un nouvel utilisateur dans son propre Tenant' })
    @ApiResponse({ status: 201, type: UserEntity })
    create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
        // On force la création de l'utilisateur dans le même Tenant que l'admin/gestionnaire connecté
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
        return this.usersService.create(createUserDto, req.user.tenantId);
    }

    @Get()
    @ApiOperation({ summary: 'Récupérer tous les utilisateurs de son Tenant' })
    @ApiResponse({ status: 200, type: [UserEntity] })
    findAll(@Request() req: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
        return this.usersService.findAll(req.user.tenantId);
    }

    @Get(':id')
    @ApiOperation({ summary: "Récupérer les informations publiques d'un utilisateur" })
    @ApiResponse({ status: 200, type: UserEntity })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
    @ApiResponse({ status: 200, type: UserEntity })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un utilisateur' })
    @ApiResponse({ status: 200, description: 'Utilisateur supprimé avec succès.' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
