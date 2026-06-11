import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateHousingDto } from './dto/create-housing.dto';
import { UpdateHousingDto } from './dto/update-housing.dto';
import { HousingEntity } from './entities/housing.entity';
import { HousingService } from './housing.service';

// Interface pour typer proprement notre Request et faire taire ESLint
interface RequestWithUser extends Request {
    user: { id: string; tenantId: string };
}

@ApiTags('Logements') // Swagger
@ApiBearerAuth() // Indique que toutes les routes de ce contrôleur nécessitent une authentification par JWT
@UseGuards(JwtAuthGuard) // Applique le guard d'authentification à toutes les routes de ce contrôleur
@Controller('housing')
export class HousingController {
    constructor(private readonly housingService: HousingService) {}

    @Post()
    @ApiOperation({ summary: 'Créer un nouveau logement' })
    @ApiResponse({ status: 201, type: HousingEntity })
    create(@Body() createHousingDto: CreateHousingDto, @Request() req: RequestWithUser) {
        return this.housingService.create(createHousingDto, req.user.tenantId);
    }

    @Get()
    @ApiOperation({ summary: 'Récupérer la liste des logements de mon espace (Tenant)' })
    @ApiResponse({ status: 200, type: [HousingEntity] })
    findAll(@Request() req: RequestWithUser) {
        return this.housingService.findAll(req.user.tenantId);
    }

    @Get(':id')
    @ApiOperation({ summary: "Récupérer le détail d'un logement par son ID" })
    @ApiResponse({ status: 200, type: HousingEntity })
    findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
        // Attention: l'ID est un UUID (string) dans Prisma, on le garde en string (et non +id)
        return this.housingService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour un logement existant' })
    @ApiResponse({ status: 200, type: HousingEntity })
    update(@Param('id') id: string, @Body() updateHousingDto: UpdateHousingDto, @Request() req: RequestWithUser) {
        return this.housingService.update(id, updateHousingDto, req.user.tenantId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer définitivement un logement' })
    @ApiResponse({ status: 200, description: 'Logement supprimé avec succès.' })
    remove(@Param('id') id: string, @Request() req: RequestWithUser) {
        return this.housingService.remove(id, req.user.tenantId);
    }
}
