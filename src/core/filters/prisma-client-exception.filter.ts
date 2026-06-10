import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

// Ce décorateur indique que le filtre intercepte spécifiquement les erreurs Prisma
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        switch (exception.code) {
            case 'P2000': {
                // Code Prisma pour : "Valeur trop longue"
                const status = HttpStatus.BAD_REQUEST; // 400
                response.status(status).json({
                    statusCode: status,
                    message: `La valeur fournie pour l'un des champs est trop longue par rapport à ce qui est autorisé en base de données.`,
                    error: 'Bad Request',
                });
                break;
            }
            case 'P2002': {
                // Code Prisma pour : "Contrainte d'unicité violée"
                const status = HttpStatus.CONFLICT; // 409
                response.status(status).json({
                    statusCode: status,
                    message: `Un conflit est survenu : Un enregistrement avec ce champ unique (ex: email, plaque d'immatriculation) existe déjà.`,
                    error: 'Conflict',
                });
                break;
            }
            case 'P2003': {
                // Code Prisma pour : "Échec de la contrainte de clé étrangère"
                const status = HttpStatus.BAD_REQUEST; // 400
                response.status(status).json({
                    statusCode: status,
                    message: `Opération impossible : Cet enregistrement est lié à d'autres données dans le système (ex: impossible de supprimer un produit s'il est utilisé dans un sac).`,
                    error: 'Bad Request',
                });
                break;
            }
            case 'P2025': {
                // Code Prisma pour : "Enregistrement non trouvé"
                const status = HttpStatus.NOT_FOUND; // 404
                response.status(status).json({
                    statusCode: status,
                    message: `Ressource introuvable ou déjà supprimée.`,
                    error: 'Not Found',
                });
                break;
            }
            default:
                // Pour toutes les autres erreurs non gérées explicitement, on laisse le comportement par défaut (Internal Server Error 500)
                super.catch(exception, host);
                break;
        }
    }
}
