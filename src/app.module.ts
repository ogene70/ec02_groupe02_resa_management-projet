import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        // Indispensable pour initialiser la lecture du .env par le ConfigService de NestJS !
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
        UsersModule,
    ],
})
export class AppModule {}
