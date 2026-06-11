import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// PartialType rend automatiquement tous les champs de CreateUserDto optionnels
export class UpdateUserDto extends PartialType(CreateUserDto) {}
