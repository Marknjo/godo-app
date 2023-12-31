import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ERoles } from 'src/iam/enums/e-roles.enum'
import { Role } from '../schema/role.schema'

export class CreateRoleDto {
  @IsEnum(ERoles)
  @IsNotEmpty()
  name: ERoles

  @IsString()
  @IsNotEmpty()
  @MaxLength(500, {
    message: 'Description too long',
  })
  description: string

  @IsOptional()
  @IsMongoId()
  assignedFor?: Role //parent feature
}
