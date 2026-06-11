import { UsersService } from '../users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;

    // Création de fausses implémentations (mocks)
    const mockAuthService = {
        login: jest.fn((dto) => {
            return { access_token: 'fake_jwt_token', user: { id: '1', email: dto.email } };
        }),
        register: jest.fn((dto) => {
            return { access_token: 'fake_jwt_token', user: { id: '1', email: dto.email } };
        }),
    };

    const mockUsersService = {
        findOne: jest.fn((id) => {
            return { id, email: 'test@test.fr', nom: 'Test', prenom: 'Test' };
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: UsersService, useValue: mockUsersService },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('devrait être défini', () => {
        expect(controller).toBeDefined();
    });

    it('devrait retourner un token à la connexion (login)', async () => {
        const dto = { email: 'test@test.fr', password: 'password' };
        const result = await controller.login(dto);

        expect(result).toHaveProperty('access_token');
        expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
});
