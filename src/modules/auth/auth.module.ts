import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        ConfigModule,
        UsersModule,
        PassportModule,
        // registerAsync garantit que NestJS a bien fini de lire
        // le fichier .env avant d'initialiser le module de tokens.
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): JwtModuleOptions => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    expiresIn: (configService.get<string>('JWT_EXPIRATION') as any) || '1d',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
