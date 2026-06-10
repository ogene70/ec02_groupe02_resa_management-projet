import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
// Ce décorateur prend une liste de rôles en paramètre et les stocke sous la clé 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
