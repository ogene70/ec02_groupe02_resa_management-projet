import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './core/filters/prisma-client-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api/v1';

    // Définition du préfixe global
    app.setGlobalPrefix(globalPrefix);

    // Activation de la validation automatique (DTOs)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Retire automatiquement les champs non déclarés dans le DTO
            transform: true, // Cast les données entrantes selon les types du DTO (ex: un param URL '1' devient number, mais un @IsString() zipcode restera texte)
            forbidNonWhitelisted: true,
        }),
    );

    // Activation de l'intercepteur de Sérialisation (pour les @Exclude() sur les entités)
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // Activation du Filtre d'Exception Global Prisma
    // On précise à NestJS qu'on s'attend à recevoir un objet de type HttpAdapterHost
    // const httpAdapterHost = app.get<HttpAdapterHost>(HttpAdapterHost);
    // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapterHost.httpAdapter));

    // Activation de CORS (Indispensable pour qu'Angular puisse appeler l'API)
    app.enableCors();

    // Configuration Swagger
    const config = new DocumentBuilder()
        .setTitle('RESA API')
        .setDescription("Documentation de l'API RESA pour le projet fil rouge")
        .setVersion('1.0')
        .addBearerAuth() // Pour documenter l'authentification JWT
        .addTag('auth', "Module d'authentification")
        .addTag('users', 'Gestion des utilisateurs')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3000;
    // '0.0.0.0' est recommandé pour permettre l'accès externe via Docker
    await app.listen(port, '0.0.0.0');

    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log(`📑 Swagger Docs: http://localhost:${port}/api`);
}
bootstrap();
