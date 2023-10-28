import { User } from 'src/iam/users/schema/user.schema'
import { Role } from '../../roles/schema/role.schema'
import { IsMongoId } from 'class-validator'

export class CreateAccessDto {
  @IsMongoId({ message: 'Invalid user' })
  assignedTo: User

  @IsMongoId({ message: 'Invalid role' })
  roleId: Role
}
