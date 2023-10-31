import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { User } from '../../schema/user.schema'

export class CreateTeamDto {
  @IsMongoId({ message: 'Invalid User' })
  memberId: User

  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Description should be less than 500 characters' })
  description: string
}
