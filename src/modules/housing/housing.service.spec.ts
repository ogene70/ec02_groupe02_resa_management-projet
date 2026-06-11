import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

// NOUVEAU : On simule complètement bcrypt avant même de lancer les tests
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

describe('AuthService', () => {
    let service: AuthService;

    const mockPrismaService = {
        user: { findUnique: jest.fn() },
        $transaction: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('signed_token'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, { provide: PrismaService, useValue: mockPrismaService }, { provide: JwtService, useValue: mockJwtService }],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('devrait être défini', () => {
        expect(service).toBeDefined();
    });

    it("devrait lever une UnauthorizedException si l'utilisateur n'existe pas (login)", async () => {
        mockPrismaService.user.findUnique.mockResolvedValue(null);
        await expect(service.login({ email: 'fake@fake.fr', password: 'password' })).rejects.toThrow(UnauthorizedException);
    });

    it('devrait lever une UnauthorizedException si le mot de passe est faux (login)', async () => {
        mockPrismaService.user.findUnique.mockResolvedValue({
            id: '1',
            email: 'test@test.fr',
            password_hash: 'hashed_password',
        });

        // NOUVEAU : On utilise directement la fonction mockée
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(service.login({ email: 'test@test.fr', password: 'wrong_password' })).rejects.toThrow(UnauthorizedException);
    });
});
