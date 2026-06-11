import { Test, TestingModule } from '@nestjs/testing';
import { HousingController } from './housing.controller';
import { HousingService } from './housing.service';
import { CreateHousingDto } from './dto/create-housing.dto';
import { StatutLogement } from '@prisma/client';

describe('HousingController', () => {
    let controller: HousingController;
    let service: HousingService;

    const mockTenantId = 'tenant-123';

    // Simulation de req.user tel que fournit par notre JwtStrategy
    const mockRequest = {
        user: { id: 'user-123', tenantId: mockTenantId },
    } as any;

    // Création d'un "Bouchon" (Mock) pour notre service
    const mockHousingService = {
        create: jest.fn((dto, tenantId) => ({ id: 'logement-1', ...dto, tenant_id: tenantId })),
        findAll: jest.fn((tenantId) => [{ id: 'logement-1', tenant_id: tenantId, titre: 'Test' }]),
        findOne: jest.fn((id, tenantId) => ({ id, tenant_id: tenantId, titre: 'Test' })),
        update: jest.fn((id, dto, tenantId) => ({ id, ...dto, tenant_id: tenantId })),
        remove: jest.fn((id, tenantId) => ({ message: 'Logement supprimé avec succès.' })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HousingController],
            providers: [{ provide: HousingService, useValue: mockHousingService }],
        }).compile();

        controller = module.get<HousingController>(HousingController);
        service = module.get<HousingService>(HousingService);
    });

    it('devrait être défini', () => {
        expect(controller).toBeDefined();
    });

    it('devrait créer un logement en passant le bon tenantId', async () => {
        const dto: CreateHousingDto = {
            titre: 'Nouveau',
            capacite: 2,
            adresse: '123 rue',
            ville: 'Paris',
            code_postal: '75000',
        };

        const result = await controller.create(dto, mockRequest);
        expect(result.tenant_id).toEqual(mockTenantId);
        expect(service.create).toHaveBeenCalledWith(dto, mockTenantId);
    });

    it('devrait récupérer tous les logements', async () => {
        const result = await controller.findAll(mockRequest);
        expect(result.length).toBeGreaterThan(0);
        expect(service.findAll).toHaveBeenCalledWith(mockTenantId);
    });
});
