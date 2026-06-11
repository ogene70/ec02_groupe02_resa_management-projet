import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { HousingModule } from './modules/housing/housing.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
    imports: [
        // Indispensable pour initialiser la lecture du .env par le ConfigService de NestJS !
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
        UsersModule,
        HousingModule,
        BookingsModule,
        PaymentsModule,
    ],
})
export class AppModule {}
