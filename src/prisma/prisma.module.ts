import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Le décorateur @Global() rend ce module disponible partout dans l'application
@Module({
    providers: [PrismaService],
    exports: [PrismaService], // Exporte le service pour qu'il soit injectable dans nos autres services (Auth, Users...)
})
export class PrismaModule {}
